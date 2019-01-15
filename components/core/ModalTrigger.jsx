import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { registerComponent, Components } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HighlightOff from '@material-ui/icons/HighlightOff';
import classNames from 'classnames';


const styles = theme => ({
  root: {
    display: 'inline-block',
  },
  button: {},
  anchor: {},
  dialog: {},
  paper: {},
  dialogTitle: {},
  dialogContent: {
    paddingTop: '4px',
  },
  exitButton: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

class ModalTrigger extends PureComponent {

  constructor (props) {
    super(props);

    this.state = { modalIsOpen: false };


  }

  componentDidMount() {
    if (this.props.action) {
      this.props.action({
        openModal: this.openModal,
        closeModal: this.closeModal,
      });
    }
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render () {
    const {
      className,
      dialogClassName,
      labelId,
      component,
      titleId,
      type,
      children,
      classes,
    } = this.props;

console.log('my modal here');

    const intl = this.context.intl;

    const label = labelId ? intl.formatMessage({ id: labelId }) : this.props.label;
    const title = titleId ? intl.formatMessage({ id: titleId }) : this.props.title;

    const triggerComponent = component
      ?
      React.cloneElement(component, { onClick: this.openModal })
      :
      type === 'button'
        ?
        <Button className={classes.button} variant="raised" onClick={this.openModal}>{label}</Button>
        :
        <a className={classes.anchor} href="#" onClick={this.openModal}>{label}</a>;

    const childrenComponent = typeof children.type === 'function' ?
      React.cloneElement(children, { closeModal: this.closeModal }) :
      children;

    return (
      <span className={classNames('modal-trigger', classes.root, className)}>

        {triggerComponent}
        <Grid container>
          <Dialog className={classNames(dialogClassName)}
                  open={this.state.modalIsOpen}
                  onClose={this.closeModal}
                  fullWidth={true}
                  classes={{ paper: classes.paper }}
          >
          <Grid container item xs={12} justify='flex-end'>
            <Button mini={true} onClick={this.closeModal}>
              <HighlightOff color='error'/>
            </Button>
          </Grid>

            {
              title &&

              <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>
            }

            <DialogContent className={classes.dialogContent}>
              <Components.ErrorCatcher>
                {childrenComponent}
              </Components.ErrorCatcher>
            </DialogContent>

          </Dialog>
        </Grid>


      </span>
    );
  }
}


ModalTrigger.propTypes = {
  /**
   * Callback fired when the component mounts.
   * This is useful when you want to trigger an action programmatically.
   * It supports `openModal()` and `closeModal()`.
   *
   * @param {object} actions This object contains all possible actions
   * that can be triggered programmatically.
   */
  action: PropTypes.func,
  className: PropTypes.string,
  dialogClassName: PropTypes.string,
  label: PropTypes.string,
  labelId: PropTypes.string,
  component: PropTypes.object,
  title: PropTypes.node,
  titleId: PropTypes.string,
  type: PropTypes.oneOf(['link', 'button']),
  children: PropTypes.node,
  classes: PropTypes.object,
};


ModalTrigger.contextTypes = {
  intl: intlShape,
};


registerComponent('ModalTrigger', ModalTrigger, [withStyles, styles]);
