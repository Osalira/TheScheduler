import React, { useState, useEffect } from "react";
import { useApiClient } from "./ApiProvider";
import "./ArchivedWeeksPage.css";

function ArchivedWeeksPage() {
  const [archivedWeeks, setArchivedWeeks] = useState([]);
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchArchivedWeeks = async () => {
      try {
        const response = await apiClient.get("/api/archived_weeks");
        setArchivedWeeks(response.data);
      } catch (error) {
        console.error("Error fetching archived weeks:", error);
      }
    };
    fetchArchivedWeeks();
  }, [apiClient]);

  return (
    <div className="archived-weeks-page">
      <h1>Archived Weeks</h1>
      {archivedWeeks.map((week) => (
        <div key={week.id} className="archived-week">
          <h2>
            {week.week_start_date} - {week.week_end_date}
          </h2>
          <div className="archived-week-grid">
            {/* Grid Header */}
            <div className="grid-header">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="grid-day-header">
                  {day}
                </div>
              ))}
            </div>
            {/* Grid Content */}
            <div className="grid-content">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="grid-day-column">
                  {week.tasks
                    .filter((task) => task.day_of_week === day)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="grid-task-card"
                        style={{
                          gridRow: `span ${task.time_to_complete || 1}`, // Dynamic row span based on task duration
                        }}
                      >
                        <h4>{task.title}</h4>
                        <p>{task.task_description}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArchivedWeeksPage;
