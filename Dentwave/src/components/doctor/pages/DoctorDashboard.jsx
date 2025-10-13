import React from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";

const StatCard = ({ title, value, sublabel, pill, icon }) => (
  <Card className="shadow-sm-soft h-100">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="text-muted small">{title}</div>
          <div className="display-6 fw-semibold my-1">{value}</div>
          {sublabel && <div className="text-muted small">{sublabel}</div>}
        </div>
        <i className={`bi ${icon} text-muted`}></i>
      </div>
      {pill && (
        <Badge bg="success-subtle" text="success" className="mt-2 rounded-pill">
          {pill}
        </Badge>
      )}
    </Card.Body>
  </Card>
);

const ActivityItem = ({ icon, title, time }) => (
  <div className="d-flex gap-3 py-2">
    <i className={`bi ${icon} text-primary`}></i>
    <div>
      <div className="small fw-semibold">{title}</div>
      <div className="text-muted xsmall">{time}</div>
    </div>
  </div>
);

const UpcomingItem = ({ name, tag, time }) => (
  <div className="d-flex justify-content-between align-items-start py-3 border-bottom">
    <div>
      <div className="fw-semibold">{name}</div>
      <div className="text-muted xsmall">{tag}</div>
      <Button variant="link" className="p-0 xsmall">View Details</Button>
    </div>
    <Badge bg="light" text="dark" className="rounded-pill">{time}</Badge>
  </div>
);

const DoctorDashboard = () => {
  return (
    <div className="p-3 p-md-4">
      <h4 className="mb-4">Dashboard Overview</h4>

      {/* Top stat cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={6} xl={3}>
          <StatCard
            title="Total Appointments Today"
            value="12"
            sublabel=""
            pill="2 new this morning"
            icon="bi-alarm"
          />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <StatCard
            title="Pending Appointments"
            value="5"
            sublabel="Requires attention"
            icon="bi-hourglass-split"
          />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <StatCard
            title="Completed Appointments"
            value="7"
            sublabel="All good"
            icon="bi-check2-circle"
          />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <StatCard
            title="Upcoming Appointments"
            value="23"
            sublabel=""
            pill="Next 7 days"
            icon="bi-calendar3-event"
          />
        </Col>
      </Row>

      {/* Middle grid: Recent Activity + Upcoming */}
      <Row className="g-3 mb-4">
        <Col xs={12} lg={8}>
          <Card className="shadow-sm-soft h-100">
            <Card.Header className="bg-white">
              <strong>Recent Activity</strong>
            </Card.Header>
            <Card.Body>
              <ActivityItem
                icon="bi-clipboard2-check"
                title="Dr. Smith confirmed appointment for John Doe (10:00 AM)"
                time="2 minutes ago"
              />
              <ActivityItem
                icon="bi-chat-left-text"
                title="Patient Jane Miller sent a message regarding her medication"
                time="1 hour ago"
              />
              <ActivityItem
                icon="bi-file-earmark-medical"
                title="New lab results available for Patient David Lee"
                time="3 hours ago"
              />
              <ActivityItem
                icon="bi-activity"
                title="Updated vitals for Patient Emily White"
                time="Yesterday, 4:00 PM"
              />
              <ActivityItem
                icon="bi-camera-video"
                title="Dr. Reed completed a virtual consultation for Robert Green"
                time="Yesterday, 11:30 AM"
              />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={4}>
          <Card className="shadow-sm-soft h-100">
            <Card.Header className="bg-white">
              <strong>Upcoming Appointments</strong>
            </Card.Header>
            <Card.Body>
              <UpcomingItem name="Sarah Connor" tag="Annual Check-up" time="10:00 AM" />
              <UpcomingItem name="Kyle Reese" tag="Physical Therapy" time="11:30 AM" />
              <UpcomingItem name="Reese Witherspoon" tag="Dermatology Consultation" time="01:00 PM" />
              <UpcomingItem name="Arnold Schwarzenegger" tag="Cardiology Follow-up" time="02:30 PM" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick actions */}
      <Card className="shadow-sm-soft">
        <Card.Header className="bg-white">
          <strong>Quick Actions</strong>
        </Card.Header>
        <Card.Body className="d-flex flex-column flex-md-row gap-2">
          <Button className="flex-grow-1">
            <i className="bi bi-plus-circle me-2"></i>
            Schedule New Appointment
          </Button>
          <Button variant="light" className="flex-grow-1">
            <i className="bi bi-filter me-2"></i>
            Filter Appointments
          </Button>
          <Button variant="light" className="flex-grow-1">
            <i className="bi bi-gear me-2"></i>
            Manage Settings
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};
<style>{`
    :root {
  --soft-shadow: 0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06);
}

/* Sidebar base width */
.app-sidebar {
  width: 260px;
  min-height: 100vh;
}

/* Active + hover like the mock */
.sidebar-link { color: #212529; }
.sidebar-link:hover { background: #f1f3f5; }
.nav-pills .nav-link.active {
  background: #f1f3f5;
  color: #212529;
}

/* Card softness */
.shadow-sm-soft {
  border: 1px solid rgba(0,0,0,.06);
  box-shadow: var(--soft-shadow);
  border-radius: .6rem;
}

/* Smaller helper */
.xsmall { font-size: .825rem; }

/* Badge subtle (Bootstrap doesn't ship "success-subtle" text utilities by default before v5.3) */
.badge.bg-success-subtle {
  background-color: #e6f4ea;
  color: #137333;
}

/* Fix Offcanvas full height content */
.offcanvas .nav-link { border-radius: .5rem; }

`}</style>

export default DoctorDashboard;
