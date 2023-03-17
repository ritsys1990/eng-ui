import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListShell } from './StyledHeaderHelp';
import {
  Box,
  Button,
  ButtonTypes,
  ContextMenu,
  Icon,
  IconTypes,
  Link,
  Modal,
  ModalSizes,
  Popover,
  PopoverOrigin,
  Spinner,
  Text,
  TextTypes,
} from 'cortex-look-book';
import env from 'env';
import { downloadNotices } from '../../store/client/actions';
import { clientSelectors } from '../../store/client/selectors';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

export const COMPONENT_NAME = 'HeaderHelp';

const HeaderHelp = props => {
  const { ...extraProps } = props;
  const { t } = useTranslation();
  const containerRef = useRef();
  const dispatch = useDispatch();
  const [isContextOpen, setContextOpen] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const noticesBlob = useSelector(clientSelectors.selectNoticesBlob);
  const fetchingNotices = useSelector(clientSelectors.selectFetchingNotices);
  useEffect(() => {
    if (noticesBlob && noticesBlob.caller === 'tou') {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(noticesBlob.file, 'EXTRACTION TOU.pdf');
      } else {
        const url = (window.URL ? window.URL : window.webkitURL).createObjectURL(noticesBlob.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'EXTRACTION TOU.pdf';
        a.click();
      }
      dispatch(downloadNotices(true));
      setContextOpen(!isContextOpen);
    }
  }, [noticesBlob, dispatch, isContextOpen]);

  const MenuOptions = [
    { id: 'contact', text: t('Components_HeaderHelp_ContextMenu_Support') },
    { id: 'tou', text: t('Components_HeaderHelp_ContextMenu_Terms') },
    { id: 'about', text: t('Components_HeaderHelp_ContextMenu_AboutCortex') },
  ];

  const handleButtonClick = () => {
    setContextOpen(true);
  };

  const support = () => (
    <>
      <Text type={TextTypes.H2} mb={10}>
        {t('Components_HeaderHelp_SupportModal_Title')}
      </Text>
      <Text type={TextTypes.BODY} fontWeight='m' display='inline'>
        {t('Components_HeaderHelp_SupportModal_Subtitle_One')}
        {'  '}
      </Text>
      <Text type={TextTypes.BODY} display='inline'>
        {t('Components_HeaderHelp_SupportModal_Deloitte_One')}{' '}
        <Link
          to={t('support-contact-information-url', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
          external
          target='_blank'
        >
          {t('Components_HeaderHelp_SupportModal_TicketLink')}
        </Link>
        .
      </Text>
      <Text mb={4} />
      <Text type={TextTypes.BODY} fontWeight='m' display='inline'>
        {t('Components_HeaderHelp_SupportModal_Subtitle_Two')}
        {'  '}
      </Text>
      <Text type={TextTypes.BODY} display='inline'>
        {t('Components_HeaderHelp_SupportModal_Client_One')}{' '}
        <Link to={`mailto:${t('Components_HeaderHelp_SupportModal_Client_Email')}`} external>
          {t('Components_HeaderHelp_SupportModal_Client_Email')}
        </Link>
        {t('Components_HeaderHelp_SupportModal_Client_Two')}{' '}
      </Text>
    </>
  );

  const cortexVersion = () => (
    <>
      <Text type={TextTypes.H2} mb={10}>
        {t('Components_HeaderHelp_ContextMenu_AboutCortex')}
      </Text>
      <Text type={TextTypes.BODY}>
        {t('Components_HeaderHelp_AboutCortex_Version')} {env.CORTEX_VERSION}
      </Text>
    </>
  );

  const handleOptionClicked = option => {
    switch (option.id) {
      case 'contact':
        setContextOpen(!isContextOpen);
        setModalContent(support);
        setModalOpen(!isModalOpen);
        break;
      case 'tou':
        dispatch(
          downloadNotices(
            false,
            `/${env.ENVIRONMENT_NAME}${t('terms-of-use-url', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}`,
            'tou'
          )
        );
        break;
      case 'about':
        setContextOpen(!isContextOpen);
        setModalContent(cortexVersion);
        setModalOpen(!isModalOpen);
        break;
      default:
    }
  };

  return (
    <Box {...extraProps}>
      <div ref={containerRef}>
        <Button type={ButtonTypes.FLAT} onClick={() => handleButtonClick()} dataInstance={COMPONENT_NAME}>
          <Icon type={IconTypes.QUESTION_MARK} height='28px' width='28px' color='white' />
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(!isModalOpen)}
        onClickOutside={() => setModalOpen(!isModalOpen)}
        size={ModalSizes.MEDIUM}
        dataInstance={COMPONENT_NAME}
      >
        {modalContent}
      </Modal>

      <Popover
        isOpen={isContextOpen}
        anchorRef={containerRef}
        anchorOriginX={PopoverOrigin.END}
        anchorOriginY={PopoverOrigin.END}
        originX={PopoverOrigin.END}
        originY={PopoverOrigin.START}
        onClose={() => setContextOpen(false)}
        dataInstance={COMPONENT_NAME}
        mt={5}
        width={210}
      >
        <Spinner spinning={noticesBlob && noticesBlob.caller === 'tou' && fetchingNotices} overlayOpacity={0.5}>
          <ListShell>
            <ContextMenu options={MenuOptions} onOptionClicked={handleOptionClicked} dataInstance={COMPONENT_NAME} />
          </ListShell>
        </Spinner>
      </Popover>
    </Box>
  );
};

export default HeaderHelp;
