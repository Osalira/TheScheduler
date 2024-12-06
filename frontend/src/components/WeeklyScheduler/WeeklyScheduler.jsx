import React from 'react';
import PropTypes from 'prop-types';
import DroppableTimeSlot from './DroppableTimeSlot';
import TaskCard from '../TodoList/TaskCard';
import './WeeklyScheduler.css';

function WeeklyScheduler({ schedule }) {
  const days = Object.keys(schedule);
  const blockHeight = 25; // Each 30 minutes is 25px

  return (
    <div className="col-10">
      <div className="weekly-scheduler">
        <h3 className="text-center styleTitleWeeklySchedule mt-5">Weekly Scheduler</h3>
        <div className="weekly-scheduler-container">
          {/* Grid Layout */}
          <div
            className="weekly-scheduler-grid"
            style={{
              gridTemplateColumns: `100px repeat(${days.length}, 1fr)`,
              gridTemplateRows: `50px repeat(48, ${blockHeight}px)`, // 48 half-hour blocks (24 hours * 2)
            }}
          >
            {/* Time Header */}
            <div className="time-header">Time</div>

            {/* Day Headers */}
            {days.map((day) => (
              <div key={`header-${day}`} className="day-header">
                {day}
              </div>
            ))}

            {/* Time Slots */}
            {Array.from({ length: 24 }, (_, hour) => (
              <React.Fragment key={`hour-${hour}`}>
                <div
                  className="time-slot"
                  style={{
                    gridRow: `${hour * 2 + 2} / span 2`, // Occupies 2 half-hour rows
                  }}
                >
                  {`${hour}:00 - ${hour + 1}:00`}
                </div>
                {days.map((day) =>
                  Array.from({ length: 2 }, (_, half) => {
                    const timeIndex = hour * 2 + half; // Half-hour slot index
                    const task = schedule[day][timeIndex];

                    return (
                      <div key={`${day}-${hour}-${half}`} className="droppable-slot">
                        <DroppableTimeSlot id={`${day}-${timeIndex}`}>
                          {task && (
                            <TaskCard
                              task={task}
                              id={task.id}
                              origin={`${day}-${timeIndex}`}
                              style={{
                                height: `${task.duration * blockHeight}px`, // Dynamically calculate height
                              }}
                            />
                          )}
                        </DroppableTimeSlot>
                      </div>
                    );
                  })
                )}
              </React.Fragment>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

WeeklyScheduler.propTypes = {
  schedule: PropTypes.object.isRequired,
};

export default WeeklyScheduler;
