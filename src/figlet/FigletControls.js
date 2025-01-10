import { useEffect, useState } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Box from "@material-ui/core/Box"
import Grid from '@material-ui/core/Grid'
import { Card, debounce } from '@material-ui/core'

import { fonts } from "../helpers/fonts.js"
import { layout } from "../helpers/layout"
import { outputFormat } from "../helpers/outputFormat"
import { FigletContainer } from "../figlet/FigletContainer"
import { FIGLETSETTINGS_ACTIONS } from "./FigletSettingsContext"

const fontMenuItems = Object.entries(fonts).map(([fontKey, { name }]) => <MenuItem key={fontKey} value={fontKey}>{name}</MenuItem>)
const layoutMenuItems = Object.entries(layout).map(([layoutKey, { name }]) => <MenuItem key={layoutKey} value={layoutKey}>{name}</MenuItem>)
const fmtMenuItems = Object.entries(outputFormat).map(([fmtKey, { name }]) => <MenuItem key={fmtKey} value={fmtKey}>{name}</MenuItem>)

const debouncedAction = debounce((dispatchFn, action) => dispatchFn(action), 300)

export function FigletControls({ items = null, figletSettingsAction, figletSettingsState }) {
    const [localText, setlocalText] = useState(() => figletSettingsState.text)
    useEffect(() => {
        // Make text editing smoother while don't overwhelm the figlet generator too much during typing
        debouncedAction(figletSettingsAction, { type: FIGLETSETTINGS_ACTIONS.SET_TEXT, value: localText })
    }, [figletSettingsAction, localText])

    const [expanded, setExpanded] = useState('controlpanel');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <form noValidate autoComplete="off">
            <Card elevation={3} className="figlet-control-header">
                <Accordion expanded={expanded === 'controlpanel'} onChange={handleChange('controlpanel')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="controlpanela-content" id="controlpanela-header">
                        <Typography>Controls</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            {items === null &&
                                <Grid item xs={12} md={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id="fontlabel">Font</InputLabel>
                                        <Select labelId="fontlabel" id="fontSelector" variant="filled" value={figletSettingsState.font.fontKey} onChange={(e) => {
                                            figletSettingsAction({ type: FIGLETSETTINGS_ACTIONS.SET_FONT, value: fonts[e.target.value] })
                                        }}>
                                            {fontMenuItems}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="hlayoutlabel">Horizontal layout</InputLabel>
                                    <Select labelId="hlayoutlabel" id="horizontalLayoutSelector" value={figletSettingsState.horizontalLayout.value} onChange={(e) => {
                                        figletSettingsAction({ type: FIGLETSETTINGS_ACTIONS.SET_HORIZONTAL_LAYOUT, value: layout[e.target.value] })
                                    }}>
                                        {layoutMenuItems}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="vlayoutlabel">Vertical layout</InputLabel>
                                    <Select labelId="vlayoutlabel" id="verticalLayoutSelector" value={figletSettingsState.verticalLayout.value} onChange={(e) => {
                                        figletSettingsAction({ type: FIGLETSETTINGS_ACTIONS.SET_VERTICAL_LAYOUT, value: layout[e.target.value] })
                                    }}>
                                        {layoutMenuItems}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="standard-number"
                                        label="Width"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={figletSettingsState.width}
                                        min={20}
                                        max={5000}
                                        onChange={(e) => {
                                            figletSettingsAction({ type: FIGLETSETTINGS_ACTIONS.SET_WIDTH, value: e.target.value })
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="outputFormatLabel">Output Format</InputLabel>
                                    <Select labelId="outputFormatLabel" id="outputFormatSelector" value={figletSettingsState.fmt.value} onChange={(e) => {
                                        figletSettingsAction({ type: FIGLETSETTINGS_ACTIONS.SET_OUTPUT_FORMAT, value: outputFormat[e.target.value] })
                                    }}>
                                        {fmtMenuItems}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={figletSettingsState.whitespaceBreak}
                                                onChange={(e) => {
                                                    figletSettingsAction({ type: FIGLETSETTINGS_ACTIONS.SET_WHITESPACE_BREAK, value: e.target.checked })
                                                }}
                                                name="whitespaceBreakCheckbox"
                                                color="primary"
                                            />
                                        }
                                        label="Whitespace Break"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl fullWidth>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Text"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={localText}
                                        onChange={(e) => {
                                            setlocalText(e.target.value)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Card>
            <Grid item xs={12} >
                {items === null
                    ? <FigletContainer
                        text={figletSettingsState.text}
                        font={figletSettingsState.font}
                        width={figletSettingsState.width}
                        horizontalLayout={figletSettingsState.horizontalLayout.value}
                        verticalLayout={figletSettingsState.verticalLayout.value}
                        whitespaceBreak={figletSettingsState.whitespaceBreak}
                        fmt={figletSettingsState.fmt}
                    />
                    : items.length > 0
                        ? items.map((currentFont) => (
                            <FigletContainer
                                key={currentFont.fontKey}
                                text={figletSettingsState.text}
                                font={currentFont}
                                width={figletSettingsState.width}
                                horizontalLayout={figletSettingsState.horizontalLayout.value}
                                verticalLayout={figletSettingsState.verticalLayout.value}
                                whitespaceBreak={figletSettingsState.whitespaceBreak}
                                fmt={figletSettingsState.fmt}
                            />
                        ))
                        : <Box>No items available</Box>
                }
            </Grid>
        </form >)
}
