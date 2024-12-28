import unidecode
from collections import defaultdict
from ..models.menu_models import Collection, Category, File
from natsort import natsorted


def create_searchfield(result):
    return (
        result["displayName"]
        + " "
        + unidecode.unidecode(result["displayName"]).lower()
        + " "
        + result["category_display_name"]
        + " "
        + unidecode.unidecode(result["category_display_name"]).lower()
        + " "
        + result["textname"]
    )


def create_cat_searchfield(result):
    return (
        result["category_display_name"]
        + " "
        + unidecode.unidecode(result["category_display_name"]).lower()
        + " "
        + result["category"]
    )


def structure_menu_data(query_result, language):
    result = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))

    for file in query_result:
        if not "collection" in file or not "category" in file:
            continue
        collection = file["collection"]
        category = file["category"]
        category_display_name = file["category_display_name"]
        file_info = File(
            filename=file.get("filename"),
            textname=file.get("textname"),
            displayName=file.get("displayName"),
            search_field=create_searchfield(file),
        )

        result[collection][category]["category"] = category
        result[collection][category]["categorydisplayname"] = category_display_name
        result[collection][category]["categorysearchfield"] = create_cat_searchfield(
            file
        )
        result[collection][category]["files"].append(file_info)


    navigation_menu_data = []

    if language == "pa":
        navigation_menu_data = [
            Collection(
                collection=collection,
                categories=[
                    Category(
                        category=cat_info["category"],
                        categorydisplayname=cat_info["categorydisplayname"],
                        categorysearch_field=cat_info["categorysearchfield"],
                        files=cat_info["files"],
                    )
                    for cat_info in categories.values()
                ],
            )
            for collection, categories in result.items()
        ]

    else:
        navigation_menu_data = [
            Collection(
                collection=collection,
                categories=[
                    Category(
                        category=cat_info["category"],
                        categorydisplayname=cat_info["categorydisplayname"],
                        categorysearch_field=cat_info["categorysearchfield"],
                        files=natsorted(cat_info["files"], key=lambda x: x.filename),
                    )
                    for cat_info in natsorted(categories.values(), key=lambda x: x["categorydisplayname"])
                ],
            )
            for collection, categories in natsorted(result.items())
        ]

    return navigation_menu_data
