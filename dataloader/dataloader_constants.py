import os

DB_NAME = os.environ["ARANGO_BASE_DB_NAME"]
ARANGO_USER = os.environ["ARANGO_USER"]
ARANGO_PASSWORD = os.environ["ARANGO_ROOT_PASSWORD"]
ARANGO_HOST = f"http://{os.environ['ARANGO_HOST']}:{os.environ['ARANGO_PORT']}"
DEFAULT_SOURCE_URL = os.environ["SOURCE_FILES_URL"]
DEFAULT_TSV_URL = os.environ["TSV_FILES_URL"]

METADATA_DIR = "../metadata/"
METADATA_SCHEMAS = METADATA_DIR + "schemas/"

LANG_TIBETAN = "tib"
LANG_SANSKRIT = "skt"
LANG_CHINESE = "chn"
LANG_PALI = "pli"

DEFAULT_LANGS = (
    LANG_CHINESE,
    LANG_SANSKRIT,
    LANG_TIBETAN,
    LANG_PALI,
)

COLLECTION_PARALLELS = "parallels"
COLLECTION_PARALLELS_MULTI = "parallels_multi"
COLLECTION_PARALLELS_SORTED_BY_FILE = "parallels_sorted_file"
COLLECTION_SEGMENTS = "segments"
COLLECTION_SEGMENTS_PAGES = "segments_pages"
COLLECTION_LANGUAGES = "languages"
COLLECTION_FILES = "files"
COLLECTION_MENU_COLLECTIONS = "menu_collections"
COLLECTION_MENU_CATEGORIES = "menu_categories"


GLOBAL_STATS_CATEGORIES = "global_stats_categories"
GLOBAL_STATS_FILES = "global_stats_files"


COLLECTION_SEARCH_INDEX_TIB = "search_index_tib"
COLLECTION_SEARCH_INDEX_SKT = "search_index_skt"
COLLECTION_SEARCH_INDEX_PLI = "search_index_pli"
COLLECTION_SEARCH_INDEX_CHN = "search_index_chn"

SKT_TSV_DATA_PATH = DEFAULT_TSV_URL + "skt/"
PLI_TSV_DATA_PATH = DEFAULT_TSV_URL + "pli/"
TIB_TSV_DATA_PATH = DEFAULT_TSV_URL + "tib/"
CHN_TSV_DATA_PATH = DEFAULT_TSV_URL + "chn/"

VIEW_SEARCH_INDEX_TIB = "search_index_tib_view"
VIEW_SEARCH_INDEX_TIB_FUZZY = "search_index_tib_fuzzy_view"
VIEW_SEARCH_INDEX_SKT = "search_index_skt_view"
VIEW_SEARCH_INDEX_PLI = "search_index_pli_view"
VIEW_SEARCH_INDEX_CHN = "search_index_chn_view"

TIBETAN_ANALYZER = "tibetan_analyzer"
TIBETAN_FUZZY_ANALYZER = "tibetan_fuzzy_analyzer"
SANSKRIT_ANALYZER = "sanskrit_analyzer"
PALI_ANALYZER = "pali_analyzer"
CHINESE_ANALYZER = "text_zh"

ANALYZER_NAMES = (
    TIBETAN_ANALYZER,
    SANSKRIT_ANALYZER,
    PALI_ANALYZER,
    TIBETAN_FUZZY_ANALYZER,
)

INDEX_VIEW_NAMES = (
    VIEW_SEARCH_INDEX_SKT,
    VIEW_SEARCH_INDEX_PLI,
    VIEW_SEARCH_INDEX_CHN,
    VIEW_SEARCH_INDEX_TIB,
    VIEW_SEARCH_INDEX_TIB_FUZZY,
)

INDEX_COLLECTION_NAMES = (
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_SKT,
    COLLECTION_SEARCH_INDEX_PLI,
    COLLECTION_SEARCH_INDEX_CHN,
)

COLLECTION_NAMES = (
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_SKT,
    COLLECTION_SEARCH_INDEX_PLI,
    COLLECTION_SEARCH_INDEX_CHN,
    COLLECTION_PARALLELS,
    COLLECTION_PARALLELS_MULTI,
    COLLECTION_PARALLELS_SORTED_BY_FILE,
    COLLECTION_SEGMENTS,
    COLLECTION_SEGMENTS_PAGES,
    COLLECTION_LANGUAGES,
    COLLECTION_FILES,
    COLLECTION_MENU_COLLECTIONS,
    COLLECTION_MENU_CATEGORIES,
    GLOBAL_STATS_CATEGORIES,
    GLOBAL_STATS_FILES,
)


MATCH_LIMIT = 1000000
