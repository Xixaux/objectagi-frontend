import ObjectAGIHighlight from '@objectagi/core/ObjectAGIHighlight';
import Typography from '@mui/material/Typography';

/**
 * Theme Layouts Doc
 * This document provides information on how to use theme layouts.
 */
function MultiLanguageDoc() {
    return (
        <>
            <Typography
                variant="h4"
                className="mb-10 font-bold"
            >
                Multi Language
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React leverages{' '}
                <a
                    href="https://react.i18next.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <code>react-i18next</code>
                </a>{' '}
                to enable support for multiple languages.
            </Typography>

            <Typography
                className="mb-4 p-4 border-1 bg-yellow-50 rounded-xl text-gray-800"
                component="p"
            >
                While multi-language support is not essential for most applications, we have opted not to include translations in every app. To see translations in action, visit the Mail app and switch languages using the Toolbar. This app is uniquely configured with translations for demonstration purposes. For a deeper understanding, you can examine the source code to see how translations are implemented.
            </Typography>

            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                Usage
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                To implement translations, create a translation file named <code>i18n/en.ts</code> in the folder of the app where you want to apply them. For instance, to enable translations in the Mail app, place this file in the <code>apps/mail</code> directory.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                Then, register the language file using <code>i18next.addResourceBundle()</code> in
                <code>src/app/(control-panel)/apps/mailbox/i18n/index.ts</code>.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                In a component, utilize the <code>useTranslation</code> hook as shown below:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-jsx mb-6"
            >
                {`
                    import {useTranslation} from 'react-i18next';

                    const {t} = useTranslation('mailApp');
                
                    return (
                        <div className="p-6">
                            <Button
                                variant="contained"
                                color="primary"
                                className="w-full"
                                onClick={handleOpenDialog}
                            >
                                {t('COMPOSE')}
                            </Button>
                        </div>
                    );
                `}
            </ObjectAGIHighlight>

            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                Default Language
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                To modify the default language in ObjectAGI React, update the <code>lng</code> setting in the file <code>@i18n/i18n.ts</code>.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                For example, you can change the "en" value to "ar" to test the change.
            </Typography>

            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                Changing Language
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                To dynamically switch languages, use the <code>changeLanguage</code> function provided by the hook:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-jsx mb-6"
            >
                {`
import useI18n from '@i18n/useI18n';

const { changeLanguage } = useI18n();

const handleLanguageChange = async (newLanguageId) => {
  await changeLanguage(newLanguageId);
};
                `}
            </ObjectAGIHighlight>

            <Typography
                className="mb-4"
                component="p"
            >
                See an example implementation at
                <code>app/theme-layouts/components/LanguageSwitcher.tsx</code>.
            </Typography>

            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                I18n Provider
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React employs a custom I18nProvider to handle language settings and provide language-related functionality across the application. The I18nProvider is defined in <code>@i18n/I18nProvider.tsx</code>.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                Core features of the I18nProvider include:
            </Typography>

            <ul className="list-disc list-inside mb-4">
                <li>Handling available languages</li>
                <li>Providing the current language and its direction</li>
                <li>Supplying a function to switch the current language</li>
                <li>Integrating with ObjectAGI settings to adjust layout direction</li>
            </ul>

            <Typography
                className="mb-4"
                component="p"
            >
                To utilize the I18nProvider in your components, import and use the <code>useI18n</code> hook as follows:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-jsx mb-6"
            >
                {`
import useI18n from '@i18n/useI18n';

function MyComponent() {
  const { language, changeLanguage, langDirection } = useI18n();

  return (
    <div>
      <p>Current language: {language.title}</p>
      <p>Language direction: {langDirection}</p>
      <button onClick={() => changeLanguage('ar')}>
        Switch to Arabic
      </button>
    </div>
  );
}
                `}
            </ObjectAGIHighlight>
        </>
    );
}

export default MultiLanguageDoc;