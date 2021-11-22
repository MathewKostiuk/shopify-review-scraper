import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';

import './Navigation.css';

export default function Navigation(): JSX.Element {
  return (
    <nav className="Navigation">
      <ButtonGroup variant="outlined" aria-label="outlined primary button group">
        <Link to="/channels">
          <Button variant="outlined">
            Channels
          </Button>
        </Link>
        <Link to="/themes">
          <Button variant="outlined">
            Themes
          </Button>
        </Link>
      </ButtonGroup>
    </nav>
  );
}
