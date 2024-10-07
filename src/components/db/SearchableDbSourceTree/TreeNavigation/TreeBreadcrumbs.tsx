import React from "react";
import { NodeApi } from "react-arborist";
import { activeDbSourceTreeBreadcrumbsAtom } from "@atoms";
import {
  type DbSourceTreeNode,
  DbSourceTreeType,
} from "@components/db/SearchableDbSourceTree/types";
import { getTreeBreadcruumbs } from "@components/db/SearchableDbSourceTree/utils";
import { Box, Button, Typography } from "@mui/material";
import { lighten } from "@mui/material/styles";
import { useAtom } from "jotai";
import { SourceTypeIcon } from "src/components/db/SearchableDbSourceTree/nodeComponents/SourceTypeIcon";

type HandleBreadcrumbClickProps = {
  node: NodeApi<DbSourceTreeNode> | null | undefined;
  setBreacrumbs: React.Dispatch<
    React.SetStateAction<NodeApi<DbSourceTreeNode>[]>
  >;
};

const handleBreadcrumbClick = ({
  node,
  setBreacrumbs,
}: HandleBreadcrumbClickProps) => {
  if (!node) return;

  node?.select();
  node?.toggle();

  const crumbs = getTreeBreadcruumbs(node);
  setBreacrumbs(crumbs);
};

const TreeBreadcrumbs = ({ type }: { type: DbSourceTreeType }) => {
  const [breadcrumbs, setBreacrumbs] = useAtom(
    activeDbSourceTreeBreadcrumbsAtom,
  );

  return (
    <Box
      component="ul"
      sx={{
        display: "flex",
        listStyle: "none",
        margin: "0",
        padding: "0",
        gap: "0.25rem",
      }}
    >
      {breadcrumbs.map((node) => (
        <Box
          key={`${node.id}-${node.level}-breadcrumb`}
          component="li"
          sx={{
            clipPath:
              "polygon(0 0,calc(100% - 1rem) 0,100% 50%,calc(100% - 1rem) 100%,0 100%,1rem 50%)",
            margin: "0 calc(1rem/-2)",
            "&:first-of-type": {
              clipPath:
                "polygon(0 0,calc(100% - 1rem) 0,100% 50%,calc(100% - 1rem) 100%,0 100%)",
              marginLeft: "0",
            },
            "&:last-of-type": {
              marginRight: 0,
            },
          }}
        >
          <Button
            sx={(theme) => ({
              display: "block",
              height: "100%",
              paddingInline:
                type === DbSourceTreeType.Browser ? "1.5rem" : "1.25rem",
              ...(node.level === 0 && {
                paddingInline: "0.5rem 1.25rem",
              }),
              color: theme.palette.text.primary,
              background: theme.palette.background.selected,
              "&:hover": {
                background: lighten(theme.palette.background.selected, 0.2),
              },
            })}
            onClick={() => handleBreadcrumbClick({ node, setBreacrumbs })}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.35rem",
                fontSize:
                  type === DbSourceTreeType.Browser ? "0.85rem" : "0.7rem",
              }}
            >
              {type === DbSourceTreeType.Browser ? (
                <SourceTypeIcon
                  dataType={node.data.dataType}
                  color="action"
                  fontSize="inherit"
                />
              ) : null}
              <Typography
                variant="body2"
                color="text.primary"
                fontSize="inherit"
              >
                {node.id}
              </Typography>
            </Box>
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default TreeBreadcrumbs;
