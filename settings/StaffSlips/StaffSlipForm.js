import { cloneDeep } from 'lodash';
import React from 'react';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import TextField from '@folio/stripes-components/lib/TextField';
// eslint-disable-next-line import/no-unused-vars
import TextArea from '@folio/stripes-components/lib/TextArea';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import Paneset from '@folio/stripes-components/lib/Paneset';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Icon from '@folio/stripes-components/lib/Icon';

// eslint-disable-next-line import/no-unresolved
import ConfirmationModal from '@folio/stripes-components/lib/structures/ConfirmationModal';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';

import stripesForm from '@folio/stripes-form';
import { Field } from 'redux-form';

import StaffSlipEditor from './StaffSlipEditor';

class StaffSlipForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.beginDelete = this.beginDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);

    this.state = {
      confirmDelete: false,
    };
  }

  save(data) {
    this.props.onSave(data);
  }

  beginDelete() {
    this.setState({
      confirmDelete: true,
    });
  }

  confirmDelete(confirmation) {
    const staffSlip = this.props.initialValues;
    if (confirmation) {
      this.props.onRemove(staffSlip);
    } else {
      this.setState({ confirmDelete: false });
    }
  }

  translate(id) {
    return this.props.stripes.intl.formatMessage({
      id: `ui-circulation.settings.staffSlips.${id}`
    });
  }

  addFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-staff-slip"
          onClick={this.props.onCancel}
          icon="closeX"
          title="close"
          aria-label={this.translate('closeStaffSlipDialog')}
        />
      </PaneMenu>
    );
  }

  saveLastMenu() {
    const { pristine, submitting, initialValues } = this.props;
    const { confirmDelete } = this.state;
    const edit = initialValues && initialValues.id;
    const saveLabel = edit ? this.translate('saveAndClose') : this.translate('createStaffSlip');

    return (
      <PaneMenu>
        <Button
          id="clickable-save-staff-slip"
          type="submit"
          title={this.translate('saveAndClose')}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
          disabled={(pristine || submitting)}
        >{saveLabel}
        </Button>
      </PaneMenu>
    );
  }

  renderPaneTitle() {
    const { initialValues } = this.props;
    const staffSlip = initialValues || {};

    if (staffSlip.id) {
      return (<div><Icon size="small" icon="edit" /><span>{`${this.translate('edit')}: Staff slips - ${staffSlip.name}`}</span></div>);
    }

    return this.translate('new');
  }

  render() {
    const { stripes, handleSubmit, initialValues } = this.props;
    const staffSlip = initialValues || {};
    const { confirmDelete } = this.state;
    const disabled = !stripes.hasPerm('settings.organization.enabled');
    const name = staffSlip.name || this.translate('untitledStaffSlip');

    return (
      <form id="form-staff-slip" onSubmit={handleSubmit(this.save)}>
        <Paneset isRoot>
          <Pane defaultWidth="100%" firstMenu={this.addFirstMenu()} lastMenu={this.saveLastMenu()} paneTitle={this.renderPaneTitle()}>
            <Row>
              <Col xs={8}>
                <Field label={`${this.translate('name')} *`} name="name" id="input-staff-slip-name" component={TextField} autoFocus required fullWidth  disabled={disabled} />
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <Field label={this.translate('description')} name="description" id="input-staff-slip-description" component={TextArea} fullWidth  disabled={disabled} />
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <Field label={this.translate('display')} component={StaffSlipEditor} name="display" />
              </Col>
            </Row>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'staffSlipForm',
  navigationCheck: true,
  enableReinitialize: false,
})(StaffSlipForm);
