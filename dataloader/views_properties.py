from dataloader_constants import (
    COLLECTION_SEARCH_INDEX_SKT_PLI,
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_CHN,
    TIBETAN_ANALYZER,
    TIBETAN_FUZZY_ANALYZER,
    SANSKRIT_PALI_ANALYZER,
    CHINESE_ANALYZER,
)

PROPERTIES_SEARCH_INDEX_TIB = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_TIB: {
            "analyzers": [TIBETAN_ANALYZER],
            "fields": {"search_string_precise": {"analyzers": [TIBETAN_ANALYZER]}},
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}

PROPERTIES_SEARCH_INDEX_TIB_FUZZY = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_TIB: {
            "analyzers": [TIBETAN_FUZZY_ANALYZER],
            "fields": {
                "search_string_precise": {"analyzers": [TIBETAN_FUZZY_ANALYZER]}
            },
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}


PROPERTIES_SEARCH_INDEX_SKT_PLI = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_SKT_PLI: {
            "analyzers": [SANSKRIT_PALI_ANALYZER],
            "fields": {
                "search_string_precise": {"analyzers": [SANSKRIT_PALI_ANALYZER]},
                "search_string_fuzzy": {"analyzers": [SANSKRIT_PALI_ANALYZER]},
            },
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}


PROPERTIES_SEARCH_INDEX_CHN = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_CHN: {
            "analyzers": [CHINESE_ANALYZER],
            "fields": {"search_string_precise": {"analyzers": [CHINESE_ANALYZER]}},
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}
