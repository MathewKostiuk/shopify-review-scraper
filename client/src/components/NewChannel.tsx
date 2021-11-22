import { useNavigate } from 'react-router';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './NewChannel.css';

export default function NewChannel(): JSX.Element {
  let navigate = useNavigate();

  return (
    <div className="NewChannel">
      <header>
        <h3>Add Slack channel</h3>
        <IconButton color="primary" onClick={() => navigate("/channels/new")}>
          <AddIcon />
        </IconButton>
      </header>
    </div>
  );
}
