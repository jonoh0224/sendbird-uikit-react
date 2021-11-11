import './create-channel.scss';

import React from 'react';

import CreateChannelWrap from './components/CreateChannelWrap';
import {
  CreateChannelProvider,
  CreateChannelProviderProps,
} from './context/CreateChannelProvider';

export interface CreateChannelProps extends CreateChannelProviderProps {
  onClose?(): void;
}

const CreateChannel: React.FC<CreateChannelProps> = (props: CreateChannelProps) => {
  const {
    onBeforeCreateChannel,
    userListQuery,
    onCreateChannel,
    onClose,
  } = props;
  return (
    <CreateChannelProvider
      onBeforeCreateChannel={onBeforeCreateChannel}
      userListQuery={userListQuery}
      onCreateChannel={onCreateChannel}
    >
      <CreateChannelWrap
        onClose={onClose}
      />
    </CreateChannelProvider>
  );
}

export default CreateChannel;
