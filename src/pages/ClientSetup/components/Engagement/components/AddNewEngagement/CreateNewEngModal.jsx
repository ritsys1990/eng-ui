import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Box, Text, TextTypes, Input, Flex, IconTypes, Select, SelectTypes, Intent } from 'cortex-look-book';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import {
  getMatGlobalClientEngagements,
  addNewEngagement,
  createEngagementUser,
} from '../../../../../../store/engagement/actions';
import useTranslation from '../../../../../../hooks/useTranslation';
import { clientSelectors } from '../../../../../../store/client/selectors';
import { engagementSelectors } from '../../../../../../store/engagement/selectors';
import { EngagementStatus, EngagementTypes, formFields } from '../../constants/engagment.constants';
import SelectRollforwardEngagement from './SelectRollforwardEngagement';
import { addAddEngagementError } from '../../../../../../store/errors/actions';
import { isEmpty } from 'lodash';
import { securitySelectors } from '../../../../../../store/security/selectors';
import Roles from 'src/utils/rolesEnum';
import { isExternal } from '../../../../../../utils/securityHelper';

const COMPONENT_NAME = 'Client_Setup_Add_New_EngagementModal_CreateNew';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_Add_Engagement_CreateNew';
const RELEASE_DATE_FORMAT = 'YYYY-MM-DD';

const CreateNewEngModal = forwardRef(
  // eslint-disable-next-line sonarjs/cognitive-complexity
  ({ closeModal, mode, selectedEngagement, setRollforwardData, handleNextStep }, ref) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const selectedClient = useSelector(clientSelectors.selectClient);
    const entitiesFetching = useSelector(clientSelectors.selectFetchingClient);
    const matGlobalClientEngagements = useSelector(engagementSelectors.selectMatGlobalClientEngagements);
    const isFetchingMatClientEngagements = useSelector(engagementSelectors.selectIsFetchingMatClientEngagements);
    const clientEngagementList = useSelector(engagementSelectors.selectClientEngagementList);
    const me = useSelector(securitySelectors.selectMe);

    const [showError, setShowError] = useState(false);
    const [engName, setEngName] = useState([{ name: '' }]);
    const [auditYearEnd, setAuditYearEnd] = useState('');
    const [matEngId, setMatEngId] = useState('');
    const [entities, setEntities] = useState([]);
    const [releaseDate, setReleaseDate] = useState('');
    const [isMatEngSelected, setIsMatEngSelected] = useState(false);
    const [isMatGlobalEngSelected, setIsMatGlobalEngSelected] = useState(false);
    const [selectedMatEng, setSelectedMatEng] = useState({});
    const [selectedMatGlobalEng, setSelectedMatGlobalEng] = useState({});
    const [filteredGlobalMatEngList, setFilteredGlobalMatEngList] = useState([]);
    const [closeoutEngagements, setCloseoutEngagements] = useState([]);
    const [selectedCloseout, setSelectedCloseout] = useState({});
    useEffect(() => {
      if (selectedClient?.matCustomerNumber || selectedClient?.matClientId) {
        dispatch(
          getMatGlobalClientEngagements(
            selectedClient?.matCustomerNumber,
            selectedClient?.matClientId,
            addAddEngagementError
          )
        );
      }
    }, []);

    useEffect(() => {
      const closeout = clientEngagementList.filter(eng => eng?.closeoutStatus === EngagementStatus.APPROVED);
      setCloseoutEngagements(closeout);
    }, [clientEngagementList]);

    useEffect(() => {
      if (mode !== EngagementTypes.NEW && !isEmpty(selectedEngagement)) {
        dayjs.extend(dayjsPluginUTC);
        setEngName([{ name: selectedEngagement?.name }]);
        setAuditYearEnd(dayjs.utc(selectedEngagement?.fiscalYearEnd).year().toString());

        setEntities(selectedClient?.entities.filter(entitiy => selectedEngagement?.entityIds?.includes(entitiy?.id)));
        setReleaseDate(dayjs.utc(selectedEngagement?.reportIssuanceDate).format(RELEASE_DATE_FORMAT).toString());

        if (selectedEngagement?.matId) {
          setIsMatEngSelected(true);
          setMatEngId(selectedEngagement?.matNumber);
          setSelectedMatEng({ id: selectedEngagement.matId, number: selectedEngagement.matNumber });
        }

        if (selectedEngagement?.sourceEngagementId) {
          setSelectedCloseout({ id: selectedEngagement.sourceEngagementId });
        }
      }
    }, [mode, selectedEngagement, selectedClient]);
    useEffect(() => {
      if (matGlobalClientEngagements) setFilteredGlobalMatEngList(matGlobalClientEngagements);
    }, [matGlobalClientEngagements]);

    const isRequiredField = value => !!(value && value.length);
    const isEngUnique = (value, list) =>
      !list
        .reduce((acc, curr) => {
          acc.push(curr.name.toLowerCase());

          return acc;
        }, [])
        ?.includes(value?.[0].name.toLowerCase());
    const doesFormHaveErrors = value => Object.values(value).some(x => x !== null && x !== '');

    const onNewMatEngagementSelect = value => {
      if (value?.[0]?.id) {
        dayjs.extend(dayjsPluginUTC);
        setSelectedMatEng(value[0]);
        setIsMatEngSelected(true);
        setAuditYearEnd(dayjs.utc(value?.[0]?.fiscalYearEnd).year().toString());
        setMatEngId(value[0].number);
      } else {
        setIsMatEngSelected(false);
        setSelectedMatEng(null);
        setMatEngId('');
      }
      if (value?.[0]?.source === 'matglobal') {
        setIsMatGlobalEngSelected(true);
        setSelectedMatGlobalEng(value[0]);
        setEngName([{ name: value[0]?.name }]);
        setAuditYearEnd(dayjs.utc(value?.[0]?.fiscalYearEnd).year().toString());
      } else {
        setIsMatGlobalEngSelected(false);
        setSelectedMatGlobalEng({});
      }
    };

    const validateForm = () => {
      const errors = {};

      if (mode === EngagementTypes.EDIT && engName[0].name === selectedEngagement?.name) {
        errors.engName = null;
      } else if (engName[0].name === null || engName[0].name === '') {
        errors.engName = engName?.[0]?.name ? null : t(`${TRANSLATION_KEY}_NameError`);
      } else if (isEngUnique(engName, clientEngagementList) === false) {
        errors.engName = t(`${TRANSLATION_KEY}_Duplicated`);
      }

      if (isMatEngSelected) {
        errors.auditYearEnd = null;
      } else {
        errors.auditYearEnd =
          auditYearEnd?.length === 4 && Number.isInteger(+auditYearEnd) ? null : t(`${TRANSLATION_KEY}_AuditError`);
      }

      errors.releaseDate =
        releaseDate &&
        isRequiredField(releaseDate) &&
        dayjs(releaseDate, RELEASE_DATE_FORMAT).format(RELEASE_DATE_FORMAT) === releaseDate
          ? null
          : t(`${TRANSLATION_KEY}_ReleaseError`);

      if (mode === EngagementTypes.ROLLFORWARD && isEmpty(selectedCloseout)) {
        errors.rollforward = t(`${TRANSLATION_KEY}_RollforwardError`);
      }

      return errors;
    };

    const generatePayload = () => {
      const payload = {
        clientId: selectedClient.id,
        name: engName[0].name,
        entityIds: entities.reduce((acc, curr) => {
          acc.push(curr?.id);

          return acc;
        }, []),
        fiscalYearEnd: dayjs
          .utc(
            `${auditYearEnd}-${selectedClient?.fiscalYearEnd?.month}-${selectedClient?.fiscalYearEnd?.day}`,
            RELEASE_DATE_FORMAT
          )
          .format()
          .toString(),
        reportIssuanceDate: dayjs.utc(releaseDate).format().toString(),
      };

      if (isMatEngSelected) {
        payload.matId = selectedMatEng.id;
        payload.matNumber = selectedMatEng.number;
      }
      if (isMatGlobalEngSelected) {
        payload.matId = null;
        payload.matNumber = selectedMatGlobalEng.number;
        payload.SourceState = selectedMatGlobalEng.source;
      }

      return payload;
    };

    const handleSubmit = () => {
      const err = validateForm();
      dayjs.extend(dayjsPluginUTC);
      if (doesFormHaveErrors(err)) {
        setShowError(true);
      } else {
        const formPayload = generatePayload();
        let payload = null;

        switch (mode) {
          case EngagementTypes.ROLLFORWARD:
            payload = {
              sourceEngagementId: selectedCloseout?.id,
              confirmed: selectedCloseout?.confirmed,
              ...formPayload,
            };
            break;
          case EngagementTypes.EDIT:
            payload = {
              ...selectedEngagement,
              ...formPayload,
            };
            break;
          case EngagementTypes.NEW:
          default:
            payload = formPayload;
            break;
        }

        if (mode === EngagementTypes.ROLLFORWARD) {
          setRollforwardData(payload);
          handleNextStep();
        } else {
          dispatch(addNewEngagement(payload, mode === EngagementTypes.EDIT, addAddEngagementError)).then(res => {
            if (res) {
              const user = {
                email: me.email.toLowerCase(),
                performedBy: me.email.toLowerCase(),
                engagementId: res.id,
                roleIds: [Roles.ENGAGEMENT_OWNER, Roles.TEAM_MEMBER],
              };

              dispatch(
                createEngagementUser(res.id, user, isExternal(me), mode === EngagementTypes.EDIT, addAddEngagementError)
              ).then(userRes => {
                if (userRes) {
                  closeModal();
                }
              });
            }
          });
        }
      }
    };

    const errors = showError
      ? validateForm()
      : { [formFields.ENGNAME]: '', [formFields.AUDITYEAREND]: '', [formFields.RELEASEDATE]: '' };

    useImperativeHandle(ref, () => ({
      submit() {
        handleSubmit();
      },
    }));

    useEffect(() => {
      validateForm();
    }, [engName, auditYearEnd, releaseDate]);

    return (
      <Box width='100%' dataInstance={`${COMPONENT_NAME}`}>
        <Flex>
          <Text type={TextTypes.H2} fontWeight='l'>
            {mode === EngagementTypes.EDIT ? t(`${TRANSLATION_KEY}_Edit_Title`) : t(`${TRANSLATION_KEY}_Title`)}
          </Text>
        </Flex>
        <Box my={8}>
          <Select
            required
            filtering
            disabled={mode === EngagementTypes.EDIT && isMatEngSelected}
            type={SelectTypes.AUTO_COMPLETE}
            label={t(`${TRANSLATION_KEY}_EngName`)}
            options={filteredGlobalMatEngList}
            value={engName}
            onChange={onNewMatEngagementSelect}
            onInputChange={value => {
              setEngName([{ name: value }]);
            }}
            inputChangeDebounce={400}
            loading={isFetchingMatClientEngagements}
            emptyMessage={t(`${TRANSLATION_KEY}_EngName_NoMatEngFound`)}
            dataInstance={`${COMPONENT_NAME}-EngagementName`}
            hint={errors?.engName}
            optionValueKey='id'
            optionTextKey='name'
            intent={errors?.engName ? Intent.ERROR : null}
            mb={20}
          />
          <Box mb={20}>
            <Text type={TextTypes.H4} fontWeight='m' mb={2}>
              <Box color='red' pr={8} display='inline-block'>
                *
              </Box>
              {t(`${TRANSLATION_KEY}_AuditYear`)}
            </Text>
            <Flex alignItems='center'>
              <Input
                value={selectedClient?.fiscalYearEnd?.month}
                disabled
                maxLength={2}
                placeholder={t(`${TRANSLATION_KEY}_AuditYear_Month`)}
                dataInstance={`${COMPONENT_NAME}-Month`}
                width={70}
              />
              <Text type={TextTypes.BODY} mx={2}>
                /
              </Text>
              <Input
                width={70}
                value={selectedClient?.fiscalYearEnd?.day}
                disabled
                maxLength={2}
                placeholder={t(`${TRANSLATION_KEY}_AuditYear_Day`)}
                dataInstance={`${COMPONENT_NAME}-Day`}
              />
              <Text type={TextTypes.BODY} mx={2}>
                /
              </Text>
              <Input
                required
                value={auditYearEnd}
                onChange={e => setAuditYearEnd(e.target.value)}
                disabled={isMatEngSelected}
                placeholder={t(`${TRANSLATION_KEY}_AuditYear_Year`)}
                dataInstance={`${COMPONENT_NAME}-AuditYear`}
                type='year'
                maxLength={4}
                intent={errors?.auditYearEnd ? Intent.ERROR : null}
                width={70}
              />
            </Flex>
            {errors?.auditYearEnd && (
              <Text type={TextTypes.H4} mt={2} color='errorBorder'>
                {errors?.auditYearEnd}
              </Text>
            )}
          </Box>
          <Input
            label={t(`${TRANSLATION_KEY}_MATEngId`)}
            disabled
            value={isMatGlobalEngSelected ? selectedMatGlobalEng?.number : matEngId}
            onChange={e => setMatEngId(e.target.value)}
            placeholder={t(`${TRANSLATION_KEY}_MATEngId_Placeholder`)}
            dataInstance={`${COMPONENT_NAME}-MATEngId`}
            mb={20}
          />
          <Select
            type={SelectTypes.MULTIPLE}
            label={t(`${TRANSLATION_KEY}_Entities`)}
            options={selectedClient?.entities}
            value={entities}
            filtering
            onChange={value => setEntities(value)}
            loading={entitiesFetching}
            emptyMessage={t(`${TRANSLATION_KEY}_Entities_Placeholder`)}
            optionValueKey='id'
            optionTextKey='name'
            dataInstance={`${COMPONENT_NAME}-Entities`}
            mb={20}
          />
          <Input
            required
            label={t(`${TRANSLATION_KEY}_ReleaseDate`)}
            tooltip={{
              tooltipValue: t(`${TRANSLATION_KEY}_Tooltip`),
              tooltipIconType: IconTypes.INFO,
            }}
            value={releaseDate}
            onChange={e => setReleaseDate(e.currentTarget.value)}
            placeholder={t(`${TRANSLATION_KEY}_ReleaseDate_Year`)}
            dataInstance={`${COMPONENT_NAME}-ReleaseDate`}
            mb={20}
            type='date'
            max='3000-12-31'
            hint={errors?.releaseDate}
            intent={errors?.releaseDate ? Intent.ERROR : null}
          />
        </Box>
        {mode === EngagementTypes.ROLLFORWARD && (
          <Box my={10}>
            <SelectRollforwardEngagement
              dataInstance={`${COMPONENT_NAME}_Rollforward_Engagment`}
              selectedOption={selectedCloseout}
              closedEngagements={closeoutEngagements}
              onOptionSelected={option => {
                setSelectedCloseout(option);
              }}
            />
            {errors?.rollforward && (
              <Text type={TextTypes.H4} mt={2} color='errorBorder'>
                {errors?.rollforward}
              </Text>
            )}
          </Box>
        )}
      </Box>
    );
  }
);

export default CreateNewEngModal;
