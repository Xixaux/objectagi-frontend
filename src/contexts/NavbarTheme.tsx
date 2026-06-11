import { useNavbarTheme } from '@objectagi/core/ObjectAGISettings/hooks/objectagiThemeHooks';
import ObjectAGITheme from '@objectagi/core/ObjectAGITheme';

type NavbarThemeProps = {
	children: React.ReactNode;
};

function NavbarTheme({ children }: NavbarThemeProps) {
	const navbarTheme = useNavbarTheme();

	return <ObjectAGITheme theme={navbarTheme}>{children}</ObjectAGITheme>;
}

export default NavbarTheme;
