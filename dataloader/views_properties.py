from dataloader_constants import (
    COLLECTION_SEARCH_INDEX_SKT,
    COLLECTION_SEARCH_INDEX_PLI,
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_CHN,
    TIBETAN_ANALYZER,
    TIBETAN_FUZZY_ANALYZER,
    SANSKRIT_ANALYZER,
    PALI_ANALYZER,
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
            "fields": {"search_string_fuzzy": {"analyzers": [TIBETAN_FUZZY_ANALYZER]}},
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}


PROPERTIES_SEARCH_INDEX_SKT = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_SKT: {
            "analyzers": [SANSKRIT_ANALYZER],
            "fields": {
                "search_string_precise": {"analyzers": [SANSKRIT_ANALYZER]},
                "search_string_fuzzy": {"analyzers": [SANSKRIT_ANALYZER]},
            },
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}

PROPERTIES_SEARCH_INDEX_PLI = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_PLI: {
            "analyzers": [PALI_ANALYZER],
            "fields": {
                "search_string_precise": {"analyzers": [PALI_ANALYZER]},
                "search_string_fuzzy": {"analyzers": [PALI_ANALYZER]},
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
