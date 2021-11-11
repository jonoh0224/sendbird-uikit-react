import React from 'react';

import {
  EditUserProfileProvider,
  EditUserProfileProps,
} from './context/EditUserProfIleProvider';

import EditUserProfile from './components/EditUserProfileWrap';

const EditProfile: React.FC<EditUserProfileProps> = (props: EditUserProfileProps) => {
  const {
    onEditProfile,
    onCancel,
    onThemeChange,
  } = props;
  return (
    <EditUserProfileProvider
      onEditProfile={onEditProfile}
      onCancel={onCancel}
      onThemeChange={onThemeChange}
    >
      <EditUserProfile />
    </EditUserProfileProvider>
  )
}

export default EditProfile;
