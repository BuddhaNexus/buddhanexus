from dataloader_constants import (
    COLLECTION_SEARCH_INDEX_SA,
    COLLECTION_SEARCH_INDEX_PA,
    COLLECTION_SEARCH_INDEX_BO,
    COLLECTION_SEARCH_INDEX_ZH,
    TIBETAN_ANALYZER,
    TIBETAN_FUZZY_ANALYZER,
    SANSKRIT_ANALYZER,
    PALI_ANALYZER,
    CHINESE_ANALYZER,
)

PROPERTIES_SEARCH_INDEX_BO = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_BO: {
            "analyzers": [TIBETAN_ANALYZER],
            "fields": {"original": {"analyzers": [TIBETAN_ANALYZER]}},
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}

PROPERTIES_SEARCH_INDEX_BO_FUZZY = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_BO: {
            "analyzers": [TIBETAN_FUZZY_ANALYZER],
            "fields": {"analyzed": {"analyzers": [TIBETAN_FUZZY_ANALYZER]}},
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}

PROPERTIES_SEARCH_INDEX_SA = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_SA: {
            "analyzers": [SANSKRIT_ANALYZER],
            "fields": {
                "original": {"analyzers": [SANSKRIT_ANALYZER]},
                "analyzed": {"analyzers": [SANSKRIT_ANALYZER]},
            },
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}

PROPERTIES_SEARCH_INDEX_PA = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_PA: {
            "analyzers": [PALI_ANALYZER],
            "fields": {
                "original": {"analyzers": [PALI_ANALYZER]},
                "analyzed": {"analyzers": [PALI_ANALYZER]},
            },
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}


PROPERTIES_SEARCH_INDEX_ZH = {
    "cleanupIntervalStep": 0,
    "links": {
        COLLECTION_SEARCH_INDEX_ZH: {
            "analyzers": [CHINESE_ANALYZER],
            "fields": {"original": {"analyzers": [CHINESE_ANALYZER]}},
        }
    },
    "includeAllFields": True,
    "storeValues": "none",
    "trackListPositions": False,
}
