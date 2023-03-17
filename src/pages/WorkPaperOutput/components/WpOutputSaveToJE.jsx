import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonTypes,
  ContextMenu,
  Text,
  TextTypes,
  IconTypes,
  Popover,
  PopoverOrigin,
  Modal,
  ModalSizes,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { saveOutputToJE, saveTrifactaOutputToJE } from '../../../store/workpaperProcess/step3/actions';
import { wpProcessSelectors } from '../../../store/workpaperProcess/selectors';
import { WorkpaperSource } from '../../Engagement/components/AddWorkpaperModal/constants/new-workpaper';
import useTranslation from 'src/hooks/useTranslation';
import useWarningModal from 'src/hooks/useWarningModal';

const COMPONENT_NAME = 'OutputSaveToJE';

const WpOutputSaveToJE = props => {
  const {
    outputName,
    transformationId,
    workpaperId,
    outputId,
    nodeId,
    nodePath,
    eftINTEngagementLink,
    engagementId,
  } = props;
  const { t } = useTranslation();

  const [contextSaveToJERef, setContextSaveToJERef] = useState({ current: null });
  const [isOpenSaveToJE, setIsOpenSaveToJE] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const { renderWarningModal, showWarningModal } = useWarningModal();

  const handleContextButton = e => {
    setContextSaveToJERef({ current: e.target });
    setIsOpenSaveToJE(true);
  };

  const handleSaveCallback = response => {
    if (response) {
      showWarningModal(t('Components_SaveToJE_Warning_Message'), null, true);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleNavToOutput = opt => {
    if (eftINTEngagementLink) {
      if (workpaper.workpaperSource === WorkpaperSource.TRIFACTA) {
        dispatch(saveTrifactaOutputToJE(workpaperId, nodePath, nodeId, opt?.id, outputId, engagementId)).then(
          handleSaveCallback
        );
      } else {
        dispatch(saveOutputToJE(workpaperId, outputName, transformationId, opt?.id, outputId, engagementId)).then(
          handleSaveCallback
        );
      }
      setIsOpenSaveToJE(false);
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const renderContentNavMenu = () => {
    const options = [
      { id: 'JE', text: t('Pages_WorkpaperProcess_Output_SaveToJE_asJE') },
      { id: 'TB', text: t('Pages_WorkpaperProcess_Output_SaveToJE_asTB') },
    ];

    return <ContextMenu options={options} onOptionClicked={handleNavToOutput} dataInstance={COMPONENT_NAME} />;
  };

  const modalContent = () => (
    <Box>
      <Text type={TextTypes.H2} fontWeight='l' mb={9}>
        {t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Title')}
      </Text>
      <br />
      <Text>{t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Body')}</Text>
      <br />
      <Text>
        <b>{t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Note')} </b>
        {t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Body_Note')}
      </Text>
      <br />
      <br />
      <br />
    </Box>
  );

  return (
    <Box display='inline-block'>
      <Button
        type={ButtonTypes.LINK}
        iconWidth={22}
        iconColor='white'
        icon={IconTypes.TRANSFER_TO_APP}
        onClick={handleContextButton}
        dataInstance={COMPONENT_NAME}
      >
        {t('Pages_WorkpaperProcess_Output_SaveToJE_asJE')}
      </Button>

      <Popover
        isOpen={isOpenSaveToJE}
        anchorRef={contextSaveToJERef}
        anchorOriginY={PopoverOrigin.END}
        onClose={() => setIsOpenSaveToJE(false)}
        mt={4}
      >
        {renderContentNavMenu()}
      </Popover>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        primaryButtonText={t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Ok')}
        onPrimaryButtonClick={() => {
          setIsModalOpen(false);
        }}
        size={ModalSizes.LARGE}
        dataInstance={COMPONENT_NAME}
      >
        {modalContent()}
      </Modal>
      {renderWarningModal()}
    </Box>
  );
};

export default WpOutputSaveToJE;
