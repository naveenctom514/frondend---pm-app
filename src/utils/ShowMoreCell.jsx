import { Tag, Tooltip } from "antd";
import { useState } from "react";

export const ShowMoreCell = ({ data, maxItems }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };
  return (
    <div>
      {Array.isArray(data) ? (
        expanded ? (
          <div>
            {data.map((item, index) => (
              <Tooltip title={item} key={index}>
                <Tag className="m-1">{truncateText(item, 15)}</Tag>
              </Tooltip>
            ))}

            <a
              className="text-primary-2 cursor-pointer"
              onClick={toggleExpansion}
            >
              {" "}
              Less...
            </a>
          </div>
        ) : (
          <div>
            {data.slice(0, maxItems).map((item, index) => (
              <Tooltip title={item} key={index}>
                <Tag className="m-1">{truncateText(item, 15)}</Tag>
              </Tooltip>
            ))}
            {data.length > maxItems && (
              <a
                className="text-primary-2 cursor-pointer"
                onClick={toggleExpansion}
              >
                {" "}
                More...
              </a>
            )}
          </div>
        )
      ) : typeof data === "string" ? (
        <Tooltip title={data}>
          <Tag className="m-1">{truncateText(data, 15)}</Tag>
        </Tooltip>
      ) : (
        <Tag className="m-1">{data}</Tag>
      )}
    </div>
  );
};
