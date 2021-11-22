import './Theme.css';

type ThemeProps = {
  handle: string,
  url: string,
  themeId: number,
  brandId: number,
};

export default function Theme(props: ThemeProps): JSX.Element {
  const {
    handle,
    url,
    themeId,
    brandId,
  } = props;

  return (
    <div className="Theme">
      <header>
        <h3>
          { handle.toUpperCase() }
        </h3>
      </header>
      <div className="Theme__content">
        <div>{ url }</div>
        <div>{ themeId }</div>
        <div>{ brandId }</div>
      </div>
    </div>
  );
}
