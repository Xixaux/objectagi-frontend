'use client';

import { useAppSelector } from 'src/store/hooks';
import { useMemo } from 'react';
import i18n from '@i18n';
import useUser from '@auth/useUser';
import useI18n from '@i18n/useI18n';
import ObjectAGIUtils from '@objectagi/utils';
import ObjectAGINavigationHelper from '@objectagi/utils/ObjectAGINavigationHelper';
import { ObjectAGINavItemType } from '@objectagi/core/ObjectAGINavigation/types/ObjectAGINavItemType';
import { selectNavigationAll } from '../store/navigationSlice';

function useNavigation() {
	const { data: user } = useUser();
	const userRole = user?.role;
	const { languageId } = useI18n();

	const navigationData = useAppSelector(selectNavigationAll);

	const navigation = useMemo(() => {
		const _navigation = ObjectAGINavigationHelper.unflattenNavigation(navigationData);

		function setAdditionalData(data: ObjectAGINavItemType[]): ObjectAGINavItemType[] {
			return data?.map((item) => ({
				hasPermission: Boolean(ObjectAGIUtils.hasPermission(item?.auth, userRole)),
				...item,
				...(item?.translate && item?.title ? { title: i18n.t(`navigation:${item?.translate}`) } : {}),
				...(item?.children ? { children: setAdditionalData(item?.children) } : {})
			}));
		}

		const translatedValues = setAdditionalData(_navigation);

		return translatedValues;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigationData, userRole, languageId]);

	const flattenNavigation = useMemo(() => {
		return ObjectAGINavigationHelper.flattenNavigation(navigation);
	}, [navigation]);

	return { navigation, flattenNavigation };
}

export default useNavigation;
