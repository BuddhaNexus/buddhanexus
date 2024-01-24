# TODO: Refactor this function. Split into smaller chunks.

def calculate_parallel_totals():
    # This function goes over all the data and groups it into totals for the visual view
    # This takes some time to run on the full dataset.
    db = get_database()
    collection_query_cursor = db.aql.execute(
        menu_queries.QUERY_CATEGORIES_PER_COLLECTION
    )
    collections = [doc for doc in collection_query_cursor]

    # for each collection, the totals to each other collection of that same language are calculated
    for col in collections:
        language = col["language"]
        source_collection = col["collection"]
        source_col_dict = {}
        for source_cat in col["categories"]:
            source_col_dict.update(source_cat)

        language_collection_list = get_collection_list_for_language(
            language, collections
        )

        for target_collection in language_collection_list:
            selected_category_dict = get_categories_for_language_collection(
                target_collection, collections
            )

            counted_parallels = []
            for category, cat_name in source_col_dict.items():
                all_files_cursor = db.aql.execute(
                    menu_queries.QUERY_FILES_PER_CATEGORY,
                    batch_size=100000,
                    bind_vars={"category": category, "language": language},
                )
                all_files = [doc for doc in all_files_cursor]
                add_category_totals_to_db(
                    all_files,
                    category,
                    target_collection,
                    selected_category_dict,
                    language,
                )

                total_par_list = {}
                for filename in all_files:
                    parallel_count = filename["totallengthcount"]
                    for categoryname in selected_category_dict:
                        if categoryname not in total_par_list.keys():
                            if categoryname not in parallel_count.keys():
                                total_par_list[categoryname] = 0
                            else:
                                total_par_list[categoryname] = parallel_count[
                                    categoryname
                                ]
                        elif categoryname in parallel_count.keys():
                            total_par_list[categoryname] += parallel_count[categoryname]

                for key, value in total_par_list.items():
                    counted_parallels.append(
                        [
                            cat_name + " (" + category + ")",
                            selected_category_dict[key].rstrip() + "_(" + key + ")",
                            value,
                        ]
                    )

            load_parallel_counts(
                source_collection, target_collection, counted_parallels
            )


def add_category_totals_to_db(
    all_files, category, target_collection, selected_category_dict, language
):
    # for each collection, the totals of each category in that collection
    # to each other collection of that same language are calculated
    counted_parallels = []
    for filename in all_files:
        file_counted_parallels = []
        file_counted_parallels_no_zeros = []
        parallel_count = filename["totallengthcount"]
        for categoryname in selected_category_dict:
            weight_value = 0
            if categoryname in parallel_count:
                weight_value = parallel_count[categoryname]

            displayFileName = filename["filename"]
            if language == "skt" or language == "pli":
                displayFileName = filename["displayName"] + " (" + displayFileName + ")"

            new_paralllel_entry = [
                displayFileName,
                selected_category_dict[categoryname].rstrip()
                + "_("
                + categoryname
                + ")",
                weight_value,
            ]
            file_counted_parallels.append(new_paralllel_entry)
            if weight_value > 0:
                file_counted_parallels_no_zeros.append(new_paralllel_entry)
        load_parallel_counts(
            language + "_" + filename["filename"],
            target_collection,
            file_counted_parallels_no_zeros,
        )
        counted_parallels += file_counted_parallels

    load_parallel_counts(
        language + "_" + category, target_collection, counted_parallels
    )


def load_parallel_counts(source_name: str, target_name: str, total_length_count: list):
    if total_length_count:
        db = get_database()
        collection = db.collection(COLLECTION_CATEGORIES_PARALLEL_COUNT)
        doc = {
            "_key": source_name + "_" + target_name,
            "sourcecollection": source_name,
            "targetcollection": target_name,
            "totallengthcount": total_length_count,
        }
        try:
            collection.add_hash_index(["sourcecollection"], unique=False)
            collection.insert(doc)
        except (DocumentInsertError, IndexCreateError) as e:
            print("Could not load file. Error: ", e)
