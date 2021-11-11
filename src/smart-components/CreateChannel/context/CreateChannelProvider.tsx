import React, { useMemo } from 'react';
import Sendbird from 'sendbird';

import { getCreateChannel } from '../../../lib/selectors';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';

const CreateChannelContext = React.createContext(undefined);

interface UserListQuery {
  hasNext?: boolean;
  next(callback: unknown): void;
}

export interface CreateChannelProviderProps {
  children?: React.ReactNode;
  onCreateChannel(channel: Sendbird.GroupChannel): void;
  onBeforeCreateChannel?(users: Array<string>): Sendbird.GroupChannelParams;
  userListQuery?(): UserListQuery;
}

type CreateChannel = (channelParams: Sendbird.GroupChannelParams) => Promise<Sendbird.GroupChannel>;

export interface CreateChannelContextInterface {
  onBeforeCreateChannel(users: Array<string>): Sendbird.GroupChannelParams;
  createChannel: CreateChannel;
  sdk: Sendbird.SendBirdInstance;
  userListQuery?(): UserListQuery;
  onCreateChannel?(channel: Sendbird.GroupChannel): void;
}

const CreateChannelProvider: React.FC<CreateChannelProviderProps> = (props: CreateChannelProviderProps) => {
  const {
    children,
    onCreateChannel,
    onBeforeCreateChannel,
    userListQuery,
  } = props;

  const store = useSendbirdStateContext();
  const sdk = store?.stores?.sdkStore?.sdk;
  const userListQuery_ = store?.config?.userListQuery;
  const createChannel = getCreateChannel(store);

  const value = useMemo(() => {
    return {
      sdk,
      onBeforeCreateChannel,
      createChannel,
      onCreateChannel,
      userListQuery: userListQuery || userListQuery_,
    };
  }, [sdk]);

  return (
    <CreateChannelContext.Provider value={value}>
      {children}
    </CreateChannelContext.Provider>
  );
}

const useCreateChannelContext = (): CreateChannelContextInterface => (
  React.useContext(CreateChannelContext)
);

export { CreateChannelProvider, useCreateChannelContext };
