import pandas as pd
import pyewts
import re
from indic_transliteration import sanscript
from indic_transliteration.sanscript import SchemeMap, SCHEMES, transliterate

ewts = pyewts.pyewts()

df = pd.read_csv("titles.tsv", sep="\t", names=["bo", "skt"])

# convert bo to unicode
df["bo"] = df["bo"].apply(lambda x: ewts.toUnicode(x))
df["bo"] = "<2eng>" + df["bo"]
df.to_csv("titles-bo-eng.tsv", sep="\t", index=False, header=False)
df["bo"] = df["bo"].str.replace("<2eng>", "<2sar>")
df.to_csv("titles-bo-sar.tsv", sep="\t", index=False, header=False)
df_eng_bo = df[["skt", "bo"]]
df_eng_bo["skt"] = "<2bo>" + df_eng_bo["skt"]
df_eng_bo["bo"] = df_eng_bo["bo"].str.replace("<2sar>", "")
df_eng_bo.to_csv("titles-eng-bo.tsv", sep="\t", index=False, header=False)
df["bo"] = df["bo"].str.replace("<2sar>", "<2sa>")
# convert skt to unicode
df["skt"] = df["skt"].apply(
    lambda x: transliterate(x, sanscript.IAST, sanscript.DEVANAGARI)
)
df.to_csv("titles-bo-sa.tsv", sep="\t", index=False, header=False)
df_sa_bo = df[["skt", "bo"]]
df_sa_bo["skt"] = "<2bo>" + df_sa_bo["skt"]
df_sa_bo["bo"] = df_sa_bo["bo"].str.replace("<2sa>", "")
df_sa_bo.to_csv("titles-sa-bo.tsv", sep="\t", index=False, header=False)
