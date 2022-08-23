import { useEffect, useState } from "react";
import { Modal, Button, Container } from "react-bootstrap";

const ScoreBar = ({ subject, value, total, color = "white" }) => {
  return (
    <div className="d-flex align-items-center">
      <div style={{ fontSize: "1.2em" }}>{subject}:</div>
      <div
        className="scorebar"
        style={{
          width: `${Math.round((value / total) * 100)}%`,
          backgroundColor: color,
        }}
      />
      <div
        style={{ fontSize: "1rem", color: "lightgrey", marginLeft: "0.2rem" }}
      >
        {value}
      </div>
    </div>
  );
};

export default function StatsModal({ show, onHide, wins, fails, streak }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(wins.reduce((partialSum, a) => partialSum + a, 0) + fails);
  }, [wins, fails]);

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Past Scores
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container id="scorebar-container">
          {wins.map((win, index) => {
            return (
              <ScoreBar
                key={win + index}
                subject={index + 1}
                value={win}
                total={total}
              />
            );
          })}
          <ScoreBar
            subject="X"
            value={fails}
            total={total}
            color="rgb(210,0,0)"
          />
          <div style={{ fontSize: "1.2rem" }}>Total: {total}</div>
          <div style={{ fontSize: "1.2rem" }}>Streak: {streak}</div>
        </Container>
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="success" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
