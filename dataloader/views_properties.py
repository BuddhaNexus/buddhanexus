from dataloader_constants import (
    COLLECTION_SEARCH_INDEX,
    COLLECTION_SEARCH_INDEX_CHN,
)

PROPERTIES_SEARCH_INDEX = {'cleanupIntervalStep': 0, "links" : { 
                COLLECTION_SEARCH_INDEX : {
                    "analyzers" : [ 
                        "identity" ],
                     "fields" : { 
                         "search_string_precise" : { 
                             "analyzers" : [ 
                                 "text_en"
                             ]},
                         "search_string_fuzzy" : { 
                             "analyzers" : [ 
                                 "text_en"
                             ]} 

                         }
                     }},
                    "includeAllFields" : True, 
                    "storeValues" : "none", 
                    "trackListPositions" : False 
                }

PROPERTIES_SEARCH_INDEX_CHN ={'cleanupIntervalStep': 0, "links" : { 
                COLLECTION_SEARCH_INDEX_CHN : {
                    "analyzers" : [ 
                        "identity" ],
                     "fields" : { 
                         "search_string_precise" : { 
                             "analyzers" : [ 
                                 "text_zh"
                             ]
                         }
                     }}}, 
                    "includeAllFields" : True, 
                    "storeValues" : "none", 
                    "trackListPositions" : False 
            }
