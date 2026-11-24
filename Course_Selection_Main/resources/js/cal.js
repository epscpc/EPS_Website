window.addEventListener("load", function () {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    showNonCurrentDates: false, // Too visually messy
    fixedWeekCount: false,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    buttonText: {
      list: "agenda" // Mirroring ON terminology
    },
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const response = await fetch(
          "/orca-news/data?api=a"
        );
        const rawText = await response.text();
        const data = JSON.parse(rawText.replace(/[\x00-\x1F]/g, " "));

        const events = data.map((event) => {
          return {
            id: event.sid, // ON uses sid as unique event ID; schedule_id appears to be a calendar ID
            title: event.name,
            start: event.date + (event.start24 ? "T" + event.start24 : ""),
            end: event.end ? event.date + "T" + event.end : null,
            color: event.cal_mode ? "#593751" : "#6e3c8d",
            borderColor: event.cal_mode ? "#40263b" : "#6e3c8d",
            extendedProps: {
              cal_mode: event.cal_mode, // For eventClassNames
            },
          };
        });

        successCallback(events);
      } catch (error) {
        console.error("Error fetching events:", error);
        failureCallback(error);
      }
    },
    eventClassNames: function (arg) {
      // Block order highlighting
      // (ON uses cal_mode to highlight "block order" days)
      if (arg.event.extendedProps.cal_mode) {
        return [ 'block-order' ]
      }
    },
    eventDidMount: function (info) {
      if (!info.event.extendedProps.cal_mode) {
        const content = info.event.title;
        info.el._tippy = tippy(info.el, {
          content,
          allowHTML: true
        });
      }
    },
    eventWillUnmount: function (info) {
      if (info.el._tippy) {
        info.el._tippy.destroy();
      }
    },
  });
  calendar.render();
});