import './create-channel-wrap.scss';

import React, { useState, useContext } from 'react';

import sendBirdSelectors from '../../../../lib/selectors';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

import { useCreateChannelContext } from '../../context/CreateChannelProvider';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import InviteMembers from '../../../InviteMembers';

import Modal from '../../../../ui/Modal';

import {
  isBroadcastChannelEnabled,
  isSuperGroupChannelEnabled,
  setChannelType,
  createDefaultUserListQuery,
} from '../../utils';
import SendBird from 'sendbird';

export interface CreateChannelWrapProps {
  onClose?(): void;
}

const CreateChannel: React.FC<CreateChannelWrapProps> = (props: CreateChannelWrapProps) => {
  const { onClose } = props;
  const store = useSendbirdStateContext();

  const userId = store?.config?.userId;
  const createChannel = sendBirdSelectors.getCreateChannel(store);
  const sdk: SendBird.SendBirdInstance = sendBirdSelectors.getSdk(store);

  const createChannelProps = useCreateChannelContext();
  const {
    userListQuery,
    onBeforeCreateChannel,
    onCreateChannel,
  } = createChannelProps;

  const [step, setStep] = useState(0);
  const [type, setType] = useState('group');
  const { stringSet } = useContext(LocalizationContext);

  const isBroadcastAvailable = isBroadcastChannelEnabled(sdk);
  const isSupergroupAvailable = isSuperGroupChannelEnabled(sdk);

  return (
    <>
      {
        step === 0 && (
          <Modal
            titleText={stringSet?.MODAL__CREATE_CHANNEL__TITLE}
            hideFooter
            onClose={() => { onClose(); }}
          >
            <div className="sendbird-add-channel__rectangle-wrap">
              <div
                className="sendbird-add-channel__rectangle"
                onClick={() => {
                  setType('group');
                  setStep(1);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={() => {
                  setType('group');
                  setStep(1);
                }}
              >
                <Icon
                  className="sendbird-add-channel__rectangle__chat-icon"
                  type={IconTypes.CHAT}
                  fillColor={IconColors.PRIMARY}
                  width="28px"
                  height="28px"
                />
                <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
                  {stringSet.MODAL__CREATE_CHANNEL__GROUP}
                </Label>
              </div>
              {
                isSupergroupAvailable && (
                  <div
                    className="sendbird-add-channel__rectangle"
                    onClick={() => {
                      setType('supergroup');
                      setStep(1);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {
                      setType('supergroup');
                      setStep(1);
                    }}
                  >
                    <Icon
                      className="sendbird-add-channel__rectangle__supergroup-icon"
                      type={IconTypes.SUPERGROUP}
                      fillColor={IconColors.PRIMARY}
                      width="28px"
                      height="28px"
                    />
                    <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
                      {stringSet.MODAL__CREATE_CHANNEL__SUPER}
                    </Label>
                  </div>
                )
              }
              {
                isBroadcastAvailable && (
                  <div
                    className="sendbird-add-channel__rectangle"
                    onClick={() => {
                      setType('broadcast');
                      setStep(1);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {
                      setType('broadcast');
                      setStep(1);
                    }}
                  >
                    <Icon
                      className="sendbird-add-channel__rectangle__broadcast-icon"
                      type={IconTypes.BROADCAST}
                      fillColor={IconColors.PRIMARY}
                      width="28px"
                      height="28px"
                    />
                    <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
                      {stringSet.MODAL__CREATE_CHANNEL__BROADCAST}
                    </Label>
                  </div>
                )
              }
            </div>
          </Modal>
        )
      }
      {
        step === 1 && (
          <InviteMembers
            titleText={stringSet.MODAL__CREATE_CHANNEL__TITLE}
            submitText={stringSet.BUTTON__CREATE}
            closeModal={() => {
              setStep(0);
              onClose();
            }}
            idsToFilter={[userId]}
            userQueryCreator={() => ((userListQuery && typeof userListQuery === 'function')
              ? userListQuery()
              : createDefaultUserListQuery({ sdk })
            )}
            onSubmit={(selectedUsers) => {
              if (onBeforeCreateChannel) {
                const params = onBeforeCreateChannel(selectedUsers);
                setChannelType(params, type);
                createChannel(params).then((channel, error) => {
                  if (!error) {
                    onCreateChannel(channel);
                  }
                });
              } else {
                const params = new sdk.GroupChannelParams();
                params.addUserIds(selectedUsers);
                params.isDistinct = false;
                if (userId) {
                  params.operatorUserIds = [userId];
                }
                setChannelType(params, type);
                // do not have custom params
                createChannel(params).then((channel, error) => {
                  if (!error) {
                    onCreateChannel(channel);
                  }
                });
              }
            }}
          />
        )
      }
    </>
  )
}

export default CreateChannel;
