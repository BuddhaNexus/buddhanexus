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
            "fields": {"original": {"analyzers": [TIBETAN_ANALYZER]}},
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
            "fields": {"stemmed": {"analyzers": [TIBETAN_FUZZY_ANALYZER]}},
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
                "original": {"analyzers": [SANSKRIT_ANALYZER]},
                "stemmed": {"analyzers": [SANSKRIT_ANALYZER]},
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
                "original": {"analyzers": [PALI_ANALYZER]},
                "stemmed": {"analyzers": [PALI_ANALYZER]},
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
            "fields": {"original": {"analyzers": [CHINESE_ANALYZER]}},
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}
