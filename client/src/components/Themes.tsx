import { useEffect, useState } from "react";
import Theme from "./Theme";
import './Themes.css';

type ThemeProps = {
  handle: string,
  url: string,
  theme_id: number,
  brand_id: number,
};

type ThemesArray = Array<ThemeProps>;

export default function Themes(): JSX.Element {
  const [themes, setThemes] = useState<ThemesArray>([]);

  useEffect(() => {
    const fetchThemes = async () => {
      const response = await fetch(
        '/api/1.0/themes/',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      setThemes(json.themes);
    }
    fetchThemes();
  }, []);

  const ThemeElements = themes.map((theme, index) => {
    return <Theme
      key={index}
      handle={theme.handle}
      url={theme.url}
      themeId={theme.theme_id}
      brandId={theme.brand_id}
    />
  });

  return (
    <div className="Themes">
      {ThemeElements}
    </div>
  );
}
