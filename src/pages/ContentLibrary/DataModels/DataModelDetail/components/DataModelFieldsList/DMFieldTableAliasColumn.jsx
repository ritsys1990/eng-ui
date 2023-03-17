import React, { useState, useEffect, useContext } from 'react';
import { Tag, Button, ButtonTypes } from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import { AliasColumnWrapper } from '../styledComponents';
import useTranslation from '../../../../../../hooks/useTranslation';

const DMFieldTableAliasColumn = props => {
  const { pageName, rowId, colName, aliases } = props;

  const columnBody = React.useRef();
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const [style, setStyle] = useState();
  const [isExpanded, setIsExpanded] = useState(false);

  // 2 * ((Padding + Border + Margin + Line-Height)*2 + FontSize)
  const eachAliasHeight = 2 * ((theme?.space[3] + 1 + 1 + 2.5) * 2 + 14) || 0;

  useEffect(() => {
    if (aliases.length && aliases[0]) setStyle({ maxHeight: `${eachAliasHeight}px` });
    setIsExpanded(false);
  }, [aliases]);

  const handleExpandButton = () => {
    setIsExpanded(!isExpanded);
    setStyle({
      maxHeight: `${!isExpanded ? columnBody.current.scrollHeight : eachAliasHeight}px`,
    });
  };

  const showMore = t('Pages_Content_Library_DataModelFields_Aliases_ShowMore');
  const showLess = t('Pages_Content_Library_DataModelFields_Aliases_ShowLess');

  return (
    <>
      <AliasColumnWrapper
        dataInstance={`${pageName}-DMFields-${rowId}-${colName}-Wrapper-${isExpanded}`}
        ref={columnBody}
        style={style}
        width={aliases.length > 3 ? '26em' : '12em'}
      >
        {aliases?.map((eachAlias, index) => {
          if (eachAlias) {
            return (
              <Tag
                dataInstance={`${pageName}-DMFields-${rowId}-${colName}-Alias-${eachAlias}`}
                key={eachAlias + index}
                style={{ margin: '1px' }}
              >
                {eachAlias}
              </Tag>
            );
          }

          return null;
        })}
      </AliasColumnWrapper>
      {/* aliases[0] is for old aliases with empty value */}
      {aliases[0] && columnBody?.current?.scrollHeight > eachAliasHeight && (
        <Button
          dataInstance={`${pageName}-DMFields-${rowId}-${colName}-Alias-Collapse_Button`}
          type={ButtonTypes.LINK}
          onClick={handleExpandButton}
          ml={1}
        >
          {isExpanded ? showLess : showMore}
        </Button>
      )}
    </>
  );
};

export default DMFieldTableAliasColumn;
