import { AppBar, Toolbar, IconButton, Typography, Button, Stack, Menu, MenuItem} from "@mui/material"
import BugReportIcon from '@mui/icons-material/BugReport';
import Person2Icon from '@mui/icons-material/Person2';

export const MuiNavbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton size='large' edge='start' color='inherit' aria-label='logo'>
                    <BugReportIcon />
                </IconButton>

                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    Bug Triage App
                </Typography>

                <Stack direction='row' spacing={2}>
                    <Button color='inherit'>Home</Button>
                    <Button color='inherit'>Bugs</Button>
                    <Button color='inherit'>About</Button>

                    <IconButton size='large' edge='start' color='inherit' aria-label='logo'>
                        <Person2Icon />
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}