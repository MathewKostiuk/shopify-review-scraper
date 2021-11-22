import { TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
} from "@mui/material"
import { FormEvent, useState } from "react";

export default function NewChannelForm(): JSX.Element {
  const [name, setName] = useState<String>("");
  const [url, setUrl] = useState<String>("");
  const [brand, setBrand] = useState<Number>(1);
  const [submitted, setSubmitted] = useState<Boolean>(false);

  const clearForm = () => {
    setName("");
    setUrl("");
    setBrand(1);
    setSubmitted(false);
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch(
      '/api/1.0/channels/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          url,
          brand_id: brand
        })
      }
    );
    if (response.ok) {
      setSubmitted(true);
    }
  };

  return (
    <div>
      <form className="NewChannelForm" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="url"
              label="URL"
              variant="outlined"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="brand-label">Brand</InputLabel>
              <Select
                labelId="brand-label"
                id="brand"
                label="Brand"
                value={brand}
                onChange={e => setBrand(Number(e.target.value))}
                autoWidth
              >
                <MenuItem value={1}>Pixel Union</MenuItem>
                <MenuItem value={2}>Out of the Sandbox</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" type="submit">Submit</Button>
          </Grid>
        </Grid>
      </form>
      {submitted &&
        <Alert severity="success" onClose={() => clearForm()}>
          The channel was successfully added!
        </Alert>
      }
    </div>
  );
};
