import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  Collapse,
  ListItem,
  makeStyles
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'block',
    paddingTop: 0,
    paddingBottom: 0
  },
  itemLeaf: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 12
  },
  button: {
    color: "white",
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%'
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  buttonLeaf: {
    color: theme.palette.text.secondary,
    padding: '10px 8px',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightRegular,
    '&.depth-0': {
      '& $title': {
        fontWeight: theme.typography.fontWeightMedium
      }
    }
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto'
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.secondary.main
    }
  },
  iconButton: {
    padding: 8,
    minWidth: 32
  },
  startIcon: {
    margin: 0
  },
  innerPadding: {
    padding: 8
  }
}));

const NavItem = ({
  children,
  className,
  depth,
  href,
  icon,
  info: Info,
  open: openProp,
  title,
  ...rest
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(openProp);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 8;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  const style = { paddingLeft };



  return (
    <ListItem
      className={clsx(classes.itemLeaf, className, title === '' && classes.innerPadding )}
      disableGutters
      key={title}
      {...rest}
    >
      <Button
        activeClassName={classes.active}
        className={clsx(classes.buttonLeaf, `depth-${depth}`, title !== '' && classes.flexStart)}
        startIcon={title == '' && <img
          src={icon}
          size="20"
        />}
        component={RouterLink}
        exact
        style={style}
        to={href}
        classes={{ root: title == '' && classes.iconButton, startIcon: title == '' && classes.startIcon }}
      >
        {icon && title !== '' && (
          <img
            className={classes.icon}
            src={icon}
            size="20"
          />
        )}
        {title !== '' &&
          <span className={classes.title}>
            {title}
          </span>
        }
        {Info && <Info />}
      </Button>
    </ListItem >
  );
};

NavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  info: PropTypes.elementType,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired
};

NavItem.defaultProps = {
  open: false
};

export default NavItem;
