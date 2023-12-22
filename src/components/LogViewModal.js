import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import moment from "moment/moment";

function LogViewModal(props) {
  const getDuration = (start, end) => {
    var startTime = moment(start, "DD-MM-YYYY hh:mm:ss");
    var endTime = moment(end, "DD-MM-YYYY hh:mm:ss");
    var hoursDiff = endTime.diff(startTime, "hours");
    var minutesDiff = endTime.diff(startTime, "minutes");
    var secondsDiff = endTime.diff(startTime, "seconds");
    return `${hoursDiff}h ${minutesDiff}m ${secondsDiff}s`;
  };

  const getStatusColor = (status) => {
    status = status.trim();
    switch (status) {
      case "SUCCESS":
        return "#54A051";
      case "FAILED":
        return "#DC4F41";
      case "INPROCESS":
        return "#F8BE34";
      default:
        return "#FFFFFF";
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable={true}
      dialogClassName="log-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Log Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.itemData ? (
          <table className="PortalTable">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>ID</th>
                <th style={{ width: "6%" }}>Prop Code</th>
                <th style={{ width: "6%" }}>Pulled Date</th>
                <th style={{ width: "8%" }}>Job Type</th>
                <th style={{ width: "10%" }}>Process Type</th>
                <th style={{ width: "8%" }}>PMS</th>
                <th style={{ width: "10%" }}>Created At</th>
                <th style={{ width: "10%" }}>Updated At</th>
                <th style={{ width: "8%" }}>Duration</th>
                <th style={{ width: "6%" }}>Status</th>
                <th>Error Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{props.itemData.id}</td>
                <td>{props.itemData.propertyCode}</td>
                <td>{props.itemData.pulledDate}</td>
                <td>{props.itemData.jobType}</td>
                <td>{props.itemData.processType}</td>
                <td>{props.itemData.pms}</td>
                <td>
                  {moment(props.itemData.createdAt).format(
                    "YYYY-MM-DD HH:mm A"
                  )}
                </td>
                <td>
                  {moment(props.itemData.updatedAt).format(
                    "YYYY-MM-DD HH:mm A"
                  )}
                </td>
                <td>
                  {getDuration(
                    props.itemData.createdAt,
                    props.itemData.updatedAt
                  )}
                </td>
                <td
                  style={{
                    backgroundColor: getStatusColor(props.itemData.status),
                  }}
                >
                  {props.itemData.status}
                </td>
                <td>{props.itemData.errorNote}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <></>
        )}

        <pre style={{ textAlign: "start", whiteSpace: "pre-wrap" }}>
          {props.logContent}
        </pre>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogViewModal;
