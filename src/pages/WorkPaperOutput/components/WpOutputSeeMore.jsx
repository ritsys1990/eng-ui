import React from 'react';
import { Link } from 'cortex-look-book';
import env from 'env';
import { PAGE_NAME } from '../constants/WorkPaperOutput.constants';
import useTranslation from 'src/hooks/useTranslation';

const WpOutputSeeMore = props => {
  const { workpaperId } = props;
  const { t } = useTranslation();

  return (
    <Link to={`${env.ANALYTICSUI_URL}/workpapers/${workpaperId}/data`} external dataInstance={`${PAGE_NAME}-SeeMore`}>
      {t('Pages_WorkpaperProcess_Output_SeeMore')}
    </Link>
  );
};

export default WpOutputSeeMore;
