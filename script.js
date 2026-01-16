// script.js - UPDATED VERSION with Auto-Generated Visit Date/Time and End Visit Button

document.addEventListener("DOMContentLoaded", () => {
  console.log("SalesBuddy Application Initialized");

  // ========== SCREEN MANAGEMENT ==========
  const screens = {
    dashboard: document.getElementById('dashboardView'),
    sales: document.getElementById('salesScreen'),
    leads: document.getElementById('leadsScreen'),
    tasks: document.getElementById('tasksScreen'),
    leadDetail: document.getElementById('leadDetailScreen'),
    taskDetail: document.getElementById('taskDetailScreen'),
    taskForm: document.getElementById('taskFormScreen'),
    leadForm: document.getElementById('leadFormScreen'),
    opportunityForm: document.getElementById('opportunityFormScreen'),
    customerForm: document.getElementById('customerFormScreen'),
    visitForm: document.getElementById('visitFormScreen'),
    visitDetail: document.getElementById('visitDetailScreen'),
    notifications: document.getElementById('notificationsScreen'),
    ideas: document.getElementById('ideasScreen'),
    planner: document.getElementById('plannerScreen'),
    opportunities: document.getElementById('opportunitiesScreen'),
    opportunityDetail: document.getElementById('opportunityDetailScreen'),
    proposals: document.getElementById('proposalsScreen'),
    proposalDetail: document.getElementById('proposalDetailScreen'),
    customers: document.getElementById('customersScreen'),
    customerDetail: document.getElementById('customerDetailScreen'),
    complaints: document.getElementById('complaintsScreen'),
    visits: document.getElementById('visitsScreen'),
    complaintDetail: document.getElementById('complaintDetailScreen')
  };

  let currentScreen = 'dashboard';
  let screenHistory = [];
  let currentVisitId = null; // Track current visit for end visit functionality

  const showScreen = (screenId) => {
    // Hide all screens
    Object.values(screens).forEach(screen => {
      if (screen) {
        screen.classList.remove('active');
        screen.classList.add('hidden');
      }
    });

    // Show selected screen
    const screen = screens[screenId];
    if (screen) {
      screen.classList.remove('hidden');
      setTimeout(() => {
        screen.classList.add('active');
        // Scroll to top when changing screens
        screen.scrollTop = 0;
      }, 10);
      
      // Update history
      if (screenId !== currentScreen) {
        screenHistory.push(screenId);
        currentScreen = screenId;
      }
      
      // Load data for specific screens
      if (screenId === 'ideas') {
        loadInsights();
      } else if (screenId === 'planner') {
        loadPlannerEvents();
        updateCalendar(new Date());
      } else if (screenId === 'notifications') {
        updateNotificationCount();
      } else if (screenId === 'visits') {
        loadVisitsData();
      } else if (screenId === 'visitForm') {
        autoGenerateVisitDateTime();
      } else if (screenId === 'visitDetail') {
        updateEndVisitButtonVisibility();
      }
    }
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      screenHistory.pop(); // Remove current
      const prevScreen = screenHistory[screenHistory.length - 1];
      if (prevScreen && screens[prevScreen]) {
        showScreen(prevScreen);
      } else {
        showScreen('dashboard');
      }
    } else {
      showScreen('dashboard');
    }
  };

  // ========== VISIT FORM - AUTO-GENERATE DATE/TIME ==========
  function autoGenerateVisitDateTime() {
    console.log('Auto-generating visit date and time...');
    
    // Get current date and time
    const now = new Date();
    
    // Format date as YYYY-MM-DD
    const currentDate = now.toISOString().split('T')[0];
    
    // Calculate tomorrow's date (default for visit date)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    // Format time as HH:MM (round to nearest 30 minutes)
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const roundedMinute = Math.ceil(currentMinute / 30) * 30;
    
    let startHour = currentHour;
    let startMinute = roundedMinute;
    
    // If minutes overflow to next hour
    if (startMinute >= 60) {
      startHour += 1;
      startMinute = 0;
    }
    
    // Ensure hour is in 24-hour format
    if (startHour >= 24) {
      startHour = 9; // Default to 9 AM if it's past midnight
    }
    
    // Format start time
    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    
    // Calculate end time (1.5 hours after start time by default)
    let endHour = startHour + 1;
    let endMinute = startMinute + 30;
    
    // Adjust if minutes overflow
    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }
    
    // Format end time
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    // Set the values in the form
    const visitDateInput = document.getElementById('sbVisitDate');
    const visitStartTimeInput = document.getElementById('sbVisitStartTime');
    const visitEndTimeInput = document.getElementById('sbVisitEndTime');
    
    if (visitDateInput) {
      visitDateInput.value = tomorrowDate;
      console.log('Set visit date to:', tomorrowDate);
    }
    
    if (visitStartTimeInput) {
      visitStartTimeInput.value = startTime;
      console.log('Set start time to:', startTime);
    }
    
    if (visitEndTimeInput) {
      visitEndTimeInput.value = endTime;
      console.log('Set end time to:', endTime);
    }
    
    // Update auto-generated text indicators
    updateAutoGeneratedIndicators();
  }

  function updateAutoGeneratedIndicators() {
    const autoGenTexts = document.querySelectorAll('.auto-gen-text');
    autoGenTexts.forEach(text => {
      text.style.display = 'inline';
      text.style.color = '#22c55e';
      text.style.fontSize = '0.8rem';
      text.style.fontWeight = '600';
    });
  }

  // ========== VISIT DETAIL - END VISIT FUNCTIONALITY ==========
  function updateEndVisitButtonVisibility() {
    const endVisitSection = document.getElementById('endVisitSection');
    const statusButtons = document.querySelectorAll('.status-buttons .status-btn');
    
    if (!endVisitSection || !statusButtons.length) return;
    
    // Check if current status is "in-progress"
    let isInProgress = false;
    statusButtons.forEach(button => {
      if (button.classList.contains('active') && button.dataset.status === 'in-progress') {
        isInProgress = true;
      }
    });
    
    // Show/hide end visit section
    endVisitSection.style.display = isInProgress ? 'block' : 'none';
  }

  // Initialize status buttons
  function initVisitStatusButtons() {
    const statusButtons = document.querySelectorAll('#visitDetailScreen .status-btn');
    
    statusButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active button
        statusButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Update visit status in mock data
        if (currentVisitId && mockData.visits[currentVisitId]) {
          mockData.visits[currentVisitId].status = this.dataset.status;
          
          // If setting to "completed", auto-set end time
          if (this.dataset.status === 'completed') {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            // Update end time in visit data
            const currentTimeRange = mockData.visits[currentVisitId].time;
            if (currentTimeRange && currentTimeRange.includes(' - ')) {
              const startTime = currentTimeRange.split(' - ')[0];
              mockData.visits[currentVisitId].time = `${startTime} - ${currentTime}`;
              mockData.visits[currentVisitId].duration = calculateDuration(startTime, currentTime);
              
              // Update UI
              const timeEl = document.getElementById('visitDetailTime');
              if (timeEl) timeEl.textContent = `${startTime} - ${currentTime}`;
            }
            
            // Show success message
            showToast('Visit marked as completed!');
          }
          
          // Update visits list
          loadVisitsData();
          
          // Update end visit button visibility
          updateEndVisitButtonVisibility();
        }
      });
    });
    
    // Initialize end visit button
    const endVisitBtn = document.getElementById('endVisitBtn');
    if (endVisitBtn) {
      endVisitBtn.addEventListener('click', function() {
        // Set status to completed
        const completedBtn = document.querySelector('#visitDetailScreen .status-btn[data-status="completed"]');
        if (completedBtn) {
          completedBtn.click();
          
          // Get current time
          const now = new Date();
          const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          
          // Show confirmation
          showToast(`Visit ended at ${currentTime}`);
        }
      });
    }
  }

  // ========== TOAST NOTIFICATION ==========
  function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      });
    }
  }

  // ========== NETWORK STATUS FUNCTIONALITY ==========
  const networkBtn = document.getElementById('networkBtn');
  const networkDropdown = document.getElementById('networkDropdown');
  const testNetworkBtn = document.getElementById('testNetworkBtn');
  const networkSpeedEl = document.getElementById('networkSpeed');
  const networkStrengthEl = document.getElementById('networkStrength');
  const networkLatencyEl = document.getElementById('networkLatency');
  const networkStatusBadge = document.querySelector('.network-status-badge');

  // Toggle network dropdown
  if (networkBtn && networkDropdown) {
    networkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      networkDropdown.classList.toggle('hidden');
      
      // Close other dropdowns
      const notificationDropdown = document.getElementById('notificationDropdown');
      if (notificationDropdown) notificationDropdown.classList.add('hidden');
    });
  }

  // Test network speed
  if (testNetworkBtn) {
    testNetworkBtn.addEventListener('click', () => {
      testNetworkSpeed();
    });
  }

  function testNetworkSpeed() {
    if (!networkSpeedEl || !networkStrengthEl || !networkLatencyEl) return;
    
    // Show testing state
    networkSpeedEl.textContent = 'Testing...';
    networkSpeedEl.style.color = '#f59e0b';
    networkStrengthEl.textContent = 'Testing...';
    networkStrengthEl.style.color = '#f59e0b';
    networkLatencyEl.textContent = 'Testing...';
    networkLatencyEl.style.color = '#f59e0b';
    
    // Simulate network test
    setTimeout(() => {
      // Simulate results
      const downloadSpeed = (Math.random() * 50 + 10).toFixed(1);
      const uploadSpeed = (Math.random() * 20 + 5).toFixed(1);
      const latency = Math.floor(Math.random() * 100 + 20);
      
      networkSpeedEl.textContent = `${downloadSpeed} Mbps / ${uploadSpeed} Mbps`;
      networkSpeedEl.style.color = '#22c55e';
      
      // Determine strength
      let strength = 'Excellent';
      let strengthColor = '#22c55e';
      if (parseFloat(downloadSpeed) < 20) {
        strength = 'Good';
        strengthColor = '#f59e0b';
      }
      if (parseFloat(downloadSpeed) < 10) {
        strength = 'Poor';
        strengthColor = '#ef4444';
      }
      
      networkStrengthEl.textContent = strength;
      networkStrengthEl.style.color = strengthColor;
      
      networkLatencyEl.textContent = `${latency}ms`;
      networkLatencyEl.style.color = latency < 50 ? '#22c55e' : latency < 100 ? '#f59e0b' : '#ef4444';
      
      // Update network status badge
      if (networkStatusBadge) {
        networkStatusBadge.textContent = strength === 'Poor' ? 'Slow' : 'Online';
        networkStatusBadge.className = `network-status-badge ${strength === 'Poor' ? 'offline' : 'online'}`;
      }
    }, 1500);
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const networkDropdown = document.getElementById('networkDropdown');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (networkDropdown && !e.target.closest('.network-status') && !e.target.closest('.network-dropdown')) {
      networkDropdown.classList.add('hidden');
    }
    if (notificationDropdown && !e.target.closest('.notification') && !e.target.closest('.notification-dropdown')) {
      notificationDropdown.classList.add('hidden');
    }
  });

  // Initialize network status
  if (navigator.onLine) {
    testNetworkSpeed();
  } else {
    if (networkSpeedEl) networkSpeedEl.textContent = 'Offline';
    if (networkStrengthEl) networkStrengthEl.textContent = 'No Connection';
    if (networkLatencyEl) networkLatencyEl.textContent = 'N/A';
    if (networkStatusBadge) {
      networkStatusBadge.textContent = 'Offline';
      networkStatusBadge.className = 'network-status-badge offline';
    }
  }

  // ========== NOTIFICATIONS ==========
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  const viewAllNotificationsBtn = document.getElementById('viewAllNotificationsBtn');
  const markAllReadBtn = document.getElementById('markAllReadBtn');
  const notificationCount = document.querySelector('.notification span');

  // Toggle notification dropdown
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('hidden');
      
      // Close other dropdowns
      if (networkDropdown) networkDropdown.classList.add('hidden');
    });
  }

  // View all notifications
  if (viewAllNotificationsBtn) {
    viewAllNotificationsBtn.addEventListener('click', () => {
      showScreen('notifications');
      notificationDropdown.classList.add('hidden');
    });
  }

  // Mark all as read
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      document.querySelectorAll('.notification-full-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      updateNotificationCount();
    });
  }

  // Dismiss notification
  document.querySelectorAll('.notification-dismiss').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const notificationItem = this.closest('.notification-full-item');
      if (notificationItem) {
        notificationItem.style.display = 'none';
        updateNotificationCount();
      }
    });
  });

  function updateNotificationCount() {
    if (!notificationCount) return;
    
    const unreadCount = document.querySelectorAll('.notification-full-item.unread').length;
    notificationCount.textContent = unreadCount > 0 ? unreadCount : '';
    
    // Also update the notification bell count
    const bellCount = document.querySelector('.notification span');
    if (bellCount) {
      bellCount.textContent = unreadCount > 0 ? unreadCount : '';
    }
  }

  // Filter notifications
  document.querySelectorAll('#notificationsScreen .filter-option').forEach(option => {
    option.addEventListener('click', function() {
      // Update active filter
      this.closest('.filter-section').querySelectorAll('.filter-option').forEach(opt => {
        opt.classList.remove('active');
      });
      this.classList.add('active');
      
      const filter = this.dataset.filter || 'all';
      
      // Filter notifications
      document.querySelectorAll('.notification-full-item').forEach(item => {
        const type = item.dataset.type;
        
        switch(filter) {
          case 'all':
            item.style.display = 'flex';
            break;
          case 'unread':
            item.style.display = item.classList.contains('unread') ? 'flex' : 'none';
            break;
          case 'tasks':
          case 'leads':
          case 'system':
            item.style.display = type === filter ? 'flex' : 'none';
            break;
        }
      });
    });
  });

  // ========== DASHBOARD CARD NAVIGATION ==========
  // Sales Target Card
  const salesTargetCard = document.getElementById('salesTargetCard');
  if (salesTargetCard) {
    salesTargetCard.addEventListener('click', () => {
      showScreen('sales');
    });
  }

  // Tasks Card
  const tasksCard = document.getElementById('tasksCard');
  if (tasksCard) {
    tasksCard.addEventListener('click', () => {
      showScreen('tasks');
    });
  }

  // Leads Card
  const leadsCard = document.getElementById('leadsCard');
  if (leadsCard) {
    leadsCard.addEventListener('click', () => {
      showScreen('leads');
    });
  }

  // Opportunities Card
  const opportunitiesCard = document.getElementById('opportunitiesCard');
  if (opportunitiesCard) {
    opportunitiesCard.addEventListener('click', () => {
      showScreen('opportunities');
    });
  }

  // Proposals Card
  const proposalsCard = document.getElementById('proposalsCard');
  if (proposalsCard) {
    proposalsCard.addEventListener('click', () => {
      showScreen('proposals');
    });
  }

  // Customers Card
  const customersCard = document.getElementById('customersCard');
  if (customersCard) {
    customersCard.addEventListener('click', () => {
      showScreen('customers');
    });
  }

  // Complaints Card
  const complaintsCard = document.getElementById('complaintsCard');
  if (complaintsCard) {
    complaintsCard.addEventListener('click', () => {
      showScreen('complaints');
    });
  }

  // Visits Card
  const visitsCard = document.getElementById('visitsCard');
  if (visitsCard) {
    visitsCard.addEventListener('click', () => {
      loadVisitsData();
      showScreen('visits');
    });
  }

  // ========== BACK BUTTONS ==========
  const backButtons = {
    sales: document.getElementById('backFromSales'),
    leads: document.getElementById('backFromLeads'),
    tasks: document.getElementById('backFromTasks'),
    leadDetail: document.getElementById('backFromLeadDetail'),
    taskDetail: document.getElementById('backFromTaskDetail'),
    taskForm: document.getElementById('backFromTaskForm'),
    leadForm: document.getElementById('backFromLeadForm'),
    opportunityForm: document.getElementById('backFromOpportunityForm'),
    customerForm: document.getElementById('backFromCustomerForm'),
    visitForm: document.getElementById('backFromVisitForm'),
    visitDetail: document.getElementById('backFromVisitDetail'),
    notifications: document.getElementById('backFromNotifications'),
    ideas: document.getElementById('backFromIdeas'),
    planner: document.getElementById('backFromPlanner'),
    opportunities: document.getElementById('backFromOpportunities'),
    opportunityDetail: document.getElementById('backFromOpportunityDetail'),
    proposals: document.getElementById('backFromProposals'),
    proposalDetail: document.getElementById('backFromProposalDetail'),
    customers: document.getElementById('backFromCustomers'),
    customerDetail: document.getElementById('backFromCustomerDetail'),
    complaints: document.getElementById('backFromComplaints'),
    visits: document.getElementById('backFromVisits'),
    complaintDetail: document.getElementById('backFromComplaintDetail')
  };

  Object.values(backButtons).forEach(button => {
    if (button) {
      button.addEventListener('click', goBack);
    }
  });

  // ========== CREATE MENU (NAV FAB) ==========
  const navFab = document.getElementById('navFab');
  const createMenu = document.getElementById('createMenu');
  const closeCreateMenu = document.getElementById('closeCreateMenu');

  // Open create menu
  if (navFab && createMenu) {
    navFab.addEventListener('click', (e) => {
      e.stopPropagation();
      createMenu.classList.remove('hidden');
    });
  }

  // Close create menu
  if (closeCreateMenu && createMenu) {
    closeCreateMenu.addEventListener('click', () => {
      createMenu.classList.add('hidden');
    });
  }

  // Close create menu when clicking outside
  document.addEventListener('click', (e) => {
    if (createMenu && !createMenu.classList.contains('hidden')) {
      if (!e.target.closest('.nav-fab-container') && !e.target.closest('.create-menu')) {
        createMenu.classList.add('hidden');
      }
    }
  });

  // Create menu items
  document.querySelectorAll('.create-menu-item').forEach(item => {
    item.addEventListener('click', function() {
      const action = this.dataset.action;
      if (createMenu) createMenu.classList.add('hidden');
      
      switch(action) {
        case 'lead':
          showScreen('leadForm');
          break;
        case 'opportunity':
          showScreen('opportunityForm');
          break;
        case 'task':
          showScreen('taskForm');
          break;
        case 'customer':
          showScreen('customerForm');
          break;
        case 'visit':
          showScreen('visitForm');
          break;
        case 'proposal':
          alert('Proposal creation coming soon!');
          break;
      }
    });
  });

  // ========== EVENT FORM FUNCTIONALITY ==========
  const eventFormModal = document.getElementById('eventFormModal');
  const eventForm = document.getElementById('eventForm');
  const closeEventForm = document.getElementById('closeEventForm');
  const cancelEventForm = document.getElementById('cancelEventForm');
  const addEventBtn = document.getElementById('addEventBtn');

  // Open event form from planner screen
  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      openEventForm();
    });
  }

  function openEventForm(type = '') {
    // Set default values based on type
    const eventTypeSelect = document.getElementById('eventType');
    const eventDateInput = document.getElementById('eventDate');
    
    if (eventTypeSelect && type) {
      eventTypeSelect.value = type;
    }
    
    // Set default date to today
    if (eventDateInput) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      eventDateInput.value = formattedDate;
    }
    
    // Show modal
    if (eventFormModal) {
      eventFormModal.classList.remove('hidden');
    }
  }

  // Close event form
  if (closeEventForm) {
    closeEventForm.addEventListener('click', () => {
      if (eventFormModal) eventFormModal.classList.add('hidden');
    });
  }

  if (cancelEventForm) {
    cancelEventForm.addEventListener('click', () => {
      if (eventFormModal) eventFormModal.classList.add('hidden');
    });
  }

  // Handle event form submission
  if (eventForm) {
    eventForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        title: document.getElementById('eventTitle').value,
        type: document.getElementById('eventType').value,
        priority: document.getElementById('eventPriority').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        duration: document.getElementById('eventDuration').value,
        reminder: document.getElementById('eventReminder').value,
        description: document.getElementById('eventDescription').value,
        related: document.getElementById('eventRelated').value,
        location: document.getElementById('eventLocation').value
      };
      
      console.log('Event Form Submitted:', formData);
      
      // Create event object
      const newEvent = {
        id: Date.now(),
        title: formData.title,
        type: formData.type,
        priority: formData.priority,
        date: formData.date,
        time: formData.time,
        duration: `${formData.duration} min`,
        description: formData.description || 'No description provided.',
        location: formData.location || 'Not specified'
      };
      
      // Add to mock data
      if (!mockData.plannerEvents) {
        mockData.plannerEvents = [];
      }
      mockData.plannerEvents.unshift(newEvent);
      
      // Update planner events display
      loadPlannerEvents();
      
      // Show success message
      alert('Event scheduled successfully!');
      
      // Reset form and close modal
      this.reset();
      if (eventFormModal) eventFormModal.classList.add('hidden');
    });
  }

  // Close modal when clicking outside
  document.addEventListener('click', (e) => {
    if (eventFormModal && !eventFormModal.classList.contains('hidden')) {
      if (!e.target.closest('.modal-content') && !e.target.closest('#addEventBtn')) {
        eventFormModal.classList.add('hidden');
      }
    }
  });

  // ========== TASK FORM HANDLING ==========
  const taskForm = document.getElementById('taskForm');
  const cancelTaskBtn = document.getElementById('cancelTaskBtn');

  if (taskForm) {
    taskForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        title: document.getElementById('sbTaskTitle').value,
        description: document.getElementById('sbTaskDescription').value,
        associateWith: document.getElementById('sbAssociateWith').value,
        opportunity: document.getElementById('sbTaskOpportunity').value,
        taskType: document.getElementById('sbTaskType').value,
        assignTo: document.getElementById('sbTaskAssignTo').value,
        startDate: document.getElementById('sbTaskStartDate').value,
        startTime: document.getElementById('sbTaskStartTime').value,
        endDate: document.getElementById('sbTaskEndDate').value,
        endTime: document.getElementById('sbTaskEndTime').value,
        priority: document.getElementById('sbTaskPriority').value,
        status: document.getElementById('sbTaskStatus').value,
        personToMeet: document.getElementById('sbTaskPersonToMeet').value,
        reminder: document.getElementById('sbTaskReminder').value,
        notificationPerson: document.getElementById('sbTaskNotificationPerson').value,
        notificationType: document.getElementById('sbTaskNotificationType').value,
        comments: document.getElementById('sbTaskComments').value
      };
      
      console.log('Task Form Submitted:', formData);
      
      // Create a new task object
      const newTaskId = Object.keys(mockData.tasks).length + 1;
      const relatedLead = getRelatedLeadName(formData.opportunity);
      
      mockData.tasks[newTaskId] = {
        title: formData.title,
        description: formData.description || 'No description provided.',
        priority: formData.priority || 'Medium',
        status: formData.status || 'pending',
        assignedTo: formData.assignTo || 'Self',
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        startTime: formData.startTime || '09:00',
        endDate: formData.endDate,
        endTime: formData.endTime,
        taskType: formData.taskType || 'follow-up',
        opportunity: formData.opportunity || 'None',
        personToMeet: formData.personToMeet,
        reminder: formData.reminder,
        comments: formData.comments
      };
      
      alert('Task created successfully!');
      showScreen('tasks');
      
      // Reset form
      this.reset();
    });
  }

  if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener('click', () => {
      showScreen('tasks');
    });
  }

  // ========== LEAD FORM HANDLING ==========
  const leadForm = document.getElementById('salesbuddyLeadForm');
  const cancelLeadBtn = document.getElementById('cancelLeadBtn');
  const addAgencyBtn = document.getElementById('addAgencyBtn');

  // Add Agency button functionality
  if (addAgencyBtn) {
    addAgencyBtn.addEventListener('click', () => {
      const agencyName = prompt('Enter new agency name:');
      if (agencyName) {
        const agencyInput = document.getElementById('sbAgency');
        if (agencyInput) {
          agencyInput.value = agencyName;
        }
      }
    });
  }

  // Upload functionality for lead form
  const leadFormUploadBtn = document.getElementById('leadFormUploadBtn');
  const leadFormFileInput = document.getElementById('leadFormFileInput');
  const leadFormUploadedFiles = document.getElementById('leadFormUploadedFiles');

  if (leadFormUploadBtn && leadFormFileInput) {
    leadFormUploadBtn.addEventListener('click', () => {
      leadFormFileInput.click();
    });

    leadFormFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        addUploadedFile(file, leadFormUploadedFiles);
      });
    });
  }

  if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('sbLeadName').value,
        description: document.getElementById('sbLeadDescription').value,
        agency: document.getElementById('sbAgency').value,
        client: document.getElementById('sbClient').value,
        mmProducts: document.getElementById('sbMmProducts').value,
        tag: document.getElementById('sbLeadTag').value,
        assignTo: document.getElementById('sbAssignTo').value,
        primaryContact: document.getElementById('sbPrimaryContact').value,
        clientContact: document.getElementById('sbClientContact').value,
        clientProduct: document.getElementById('sbClientProduct').value,
        brand: document.getElementById('sbBrand').value,
        industry: document.getElementById('sbIndustry').value,
        rollingMonth: document.getElementById('sbRollingMonth').value,
        source: document.getElementById('sbSource').value,
        mmDivision: document.getElementById('sbMmDivision').value,
        subDivision: document.getElementById('sbSubDivision').value,
        region: document.getElementById('sbRegion').value,
        status: document.getElementById('sbLeadStatus').value,
        notification: document.getElementById('sbSendNotification').value
      };
      
      console.log('Lead Form Submitted:', formData);
      
      // Create a new lead object
      const newLeadId = Object.keys(mockData.leads).length + 1;
      const initials = formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NA';
      
      mockData.leads[newLeadId] = {
        name: formData.name,
        company: formData.client || 'Unknown Company',
        status: formData.status || 'New',
        contactNumber: '+91 98765 43210',
        region: formData.region || 'Unknown',
        industry: formData.industry || 'Unknown',
        assignedTo: formData.assignTo || 'Unassigned',
        division: formData.mmDivision || 'Unknown',
        product: formData.mmProducts || 'Unknown',
        brand: formData.brand || 'Unknown',
        agency: formData.agency || 'Unknown',
        clientContact: formData.clientContact || 'Unknown',
        clientProduct: formData.clientProduct || 'Unknown',
        rollingMonth: formData.rollingMonth || 'Unknown',
        source: formData.source || 'Unknown',
        subDivision: formData.subDivision || 'Unknown',
        lastContact: new Date().toISOString().split('T')[0],
        tags: formData.tag ? [formData.tag] : [],
        initials: initials
      };
      
      alert('Lead created successfully!');
      showScreen('leads');
      
      // Reset form
      this.reset();
      if (leadFormUploadedFiles) leadFormUploadedFiles.innerHTML = '';
    });
  }

  if (cancelLeadBtn) {
    cancelLeadBtn.addEventListener('click', () => {
      showScreen('dashboard');
    });
  }

  // ========== OPPORTUNITY FORM ==========
  const opportunityForm = document.getElementById('salesbuddyOpportunityForm');
  const cancelOpportunityBtn = document.getElementById('cancelOpportunityBtn');
  const probabilityInput = document.getElementById('sbProbability');
  const probabilityValue = document.getElementById('sbProbabilityValue');
  const addOpportunityAgencyBtn = document.getElementById('addOpportunityAgencyBtn');
  const addOpportunityClientBtn = document.getElementById('addOpportunityClientBtn');

  // Update probability display
  if (probabilityInput && probabilityValue) {
    probabilityInput.addEventListener('input', function() {
      probabilityValue.textContent = `${this.value}%`;
    });
  }

  // Add Agency button for opportunity form
  if (addOpportunityAgencyBtn) {
    addOpportunityAgencyBtn.addEventListener('click', () => {
      const agencyName = prompt('Enter new agency name:');
      if (agencyName) {
        const agencyInput = document.getElementById('sbOpportunityAgency');
        if (agencyInput) {
          agencyInput.value = agencyName;
        }
      }
    });
  }

  // Add Client button for opportunity form
  if (addOpportunityClientBtn) {
    addOpportunityClientBtn.addEventListener('click', () => {
      const clientName = prompt('Enter new client name:');
      if (clientName) {
        const clientInput = document.getElementById('sbOpportunityClient');
        if (clientInput) {
          clientInput.value = clientName;
        }
      }
    });
  }

  // Upload functionality for opportunity form
  const opportunityFormUploadBtn = document.getElementById('opportunityFormUploadBtn');
  const opportunityFormFileInput = document.getElementById('opportunityFormFileInput');
  const opportunityFormUploadedFiles = document.getElementById('opportunityFormUploadedFiles');

  if (opportunityFormUploadBtn && opportunityFormFileInput) {
    opportunityFormUploadBtn.addEventListener('click', () => {
      opportunityFormFileInput.click();
    });

    opportunityFormFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        addUploadedFile(file, opportunityFormUploadedFiles);
      });
    });
  }

  if (opportunityForm) {
    opportunityForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('sbOpportunityName').value,
        description: document.getElementById('sbOpportunityDescription').value,
        agency: document.getElementById('sbOpportunityAgency').value,
        client: document.getElementById('sbOpportunityClient').value,
        expectedValue: document.getElementById('sbExpectedValue').value,
        stage: document.getElementById('sbOpportunityStage').value,
        probability: document.getElementById('sbProbability').value,
        product: document.getElementById('sbOpportunityProducts').value,
        tag: document.getElementById('sbOpportunityTag').value,
        assignTo: document.getElementById('sbOpportunityAssignTo').value,
        primaryContact: document.getElementById('sbOpportunityPrimaryContact').value,
        clientContact: document.getElementById('sbOpportunityClientContact').value,
        clientProduct: document.getElementById('sbOpportunityClientProduct').value,
        brand: document.getElementById('sbOpportunityBrand').value,
        industry: document.getElementById('sbOpportunityIndustry').value,
        rollingMonth: document.getElementById('sbOpportunityRollingMonth').value,
        source: document.getElementById('sbOpportunitySource').value,
        division: document.getElementById('sbOpportunityMmDivision').value,
        subDivision: document.getElementById('sbOpportunitySubDivision').value,
        region: document.getElementById('sbOpportunityRegion').value,
        status: document.getElementById('sbOpportunityStatus').value,
        notification: document.getElementById('sbOpportunitySendNotification').value
      };
      
      console.log('Opportunity Form Submitted:', formData);
      
      // Create a new opportunity object
      const newOppId = Object.keys(mockData.opportunities).length + 1;
      const value = formData.expectedValue ? `₹${parseFloat(formData.expectedValue).toFixed(1)}L` : '₹0';
      
      mockData.opportunities[newOppId] = {
        title: formData.name,
        company: formData.client || 'Unknown Company',
        stage: formData.stage || 'Qualification',
        value: value,
        probability: parseInt(formData.probability) || 10,
        expectedClose: new Date().toISOString().split('T')[0],
        owner: formData.assignTo || 'Unassigned',
        description: formData.description || 'No description provided.',
        division: formData.division || 'Unknown',
        region: formData.region || 'Unknown',
        product: formData.product || 'Unknown',
        brand: formData.brand || 'Unknown',
        industry: formData.industry || 'Unknown',
        agency: formData.agency || 'Unknown',
        clientContact: formData.clientContact || 'Unknown',
        clientProduct: formData.clientProduct || 'Unknown',
        rollingMonth: formData.rollingMonth || 'Unknown',
        source: formData.source || 'Unknown',
        subDivision: formData.subDivision || 'Unknown'
      };
      
      alert('Opportunity created successfully!');
      showScreen('opportunities');
      
      // Reset form
      this.reset();
      if (probabilityValue) {
        probabilityValue.textContent = '50%';
      }
      if (opportunityFormUploadedFiles) opportunityFormUploadedFiles.innerHTML = '';
    });
  }

  if (cancelOpportunityBtn) {
    cancelOpportunityBtn.addEventListener('click', () => {
      showScreen('dashboard');
    });
  }

  // ========== CUSTOMER FORM ==========
  const customerForm = document.getElementById('salesbuddyCustomerForm');
  const cancelCustomerBtn = document.getElementById('cancelCustomerBtn');

  if (customerForm) {
    customerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        companyName: document.getElementById('sbCustomerCompanyName').value,
        contactPerson: document.getElementById('sbCustomerContactPerson').value,
        email: document.getElementById('sbCustomerEmail').value,
        phone: document.getElementById('sbCustomerPhone').value,
        industry: document.getElementById('sbCustomerIndustry').value,
        website: document.getElementById('sbCustomerWebsite').value,
        address: document.getElementById('sbCustomerAddress').value,
        city: document.getElementById('sbCustomerCity').value,
        state: document.getElementById('sbCustomerState').value,
        country: document.getElementById('sbCustomerCountry').value,
        customerType: document.getElementById('sbCustomerType').value,
        annualRevenue: document.getElementById('sbCustomerAnnualRevenue').value,
        employeeCount: document.getElementById('sbCustomerEmployeeCount').value,
        status: document.getElementById('sbCustomerStatus').value,
        accountManager: document.getElementById('sbCustomerAccountManager').value,
        customerSince: document.getElementById('sbCustomerSince').value,
        notes: document.getElementById('sbCustomerNotes').value
      };
      
      console.log('Customer Form Submitted:', formData);
      
      // Create a new customer object
      const newCustomerId = Object.keys(mockData.customers).length + 1;
      const initials = formData.companyName ? formData.companyName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NA';
      const value = formData.annualRevenue ? `₹${parseFloat(formData.annualRevenue).toFixed(1)}L` : '₹0';
      
      mockData.customers[newCustomerId] = {
        name: formData.companyName,
        contact: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        location: `${formData.city || ''}, ${formData.state || ''}`.replace(/^,\s*|\s*,/g, '').trim() || 'Unknown',
        value: value,
        initials: initials,
        since: formData.customerSince || new Date().toISOString().split('T')[0],
        status: formData.status || 'active',
        industry: formData.industry || 'Unknown',
        address: formData.address,
        website: formData.website,
        customerType: formData.customerType,
        employeeCount: formData.employeeCount,
        accountManager: formData.accountManager || 'Unassigned',
        notes: formData.notes
      };
      
      alert('Customer created successfully!');
      showScreen('customers');
      
      // Reset form
      this.reset();
    });
  }

  if (cancelCustomerBtn) {
    cancelCustomerBtn.addEventListener('click', () => {
      showScreen('dashboard');
    });
  }

  // ========== VISIT FORM - UPDATED ==========
  const visitForm = document.getElementById('salesbuddyVisitForm');
  const cancelVisitBtn = document.getElementById('cancelVisitBtn');

  if (visitForm) {
    visitForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        customer: document.getElementById('sbVisitCustomer').value,
        date: document.getElementById('sbVisitDate').value,
        startTime: document.getElementById('sbVisitStartTime').value,
        endTime: document.getElementById('sbVisitEndTime').value,
        type: document.getElementById('sbVisitType').value,
        priority: document.getElementById('sbVisitPriority').value,
        location: document.getElementById('sbVisitLocation').value,
        contactPerson: document.getElementById('sbVisitContactPerson').value,
        contactPhone: document.getElementById('sbVisitContactPhone').value,
        objective: document.getElementById('sbVisitObjective').value,
        agenda: document.getElementById('sbVisitAgenda').value,
        materials: document.getElementById('sbVisitMaterials').value,
        travelMode: document.getElementById('sbVisitTravelMode').value,
        travelTime: document.getElementById('sbVisitTravelTime').value,
        expenses: document.getElementById('sbVisitExpenses').value,
        accommodation: document.getElementById('sbVisitAccommodation').value,
        followUpDate: document.getElementById('sbVisitFollowUpDate').value,
        followUpAction: document.getElementById('sbVisitFollowUpAction').value,
        assignedTo: document.getElementById('sbVisitAssignedTo').value
      };
      
      console.log('Visit Form Submitted:', formData);
      
      // Create a new visit object
      const newVisitId = Object.keys(mockData.visits).length + 1;
      const customerName = getCustomerNameById(formData.customer);
      const duration = calculateDuration(formData.startTime, formData.endTime);
      const title = `${customerName} ${formData.type || 'Meeting'}`;
      
      mockData.visits[newVisitId] = {
        id: newVisitId,
        title: title,
        customer: customerName,
        description: formData.objective ? (formData.objective.substring(0, 100) + '...') : 'No description',
        date: formData.date,
        time: `${formData.startTime || ''} - ${formData.endTime || ''}`,
        duration: duration,
        priority: formData.priority,
        status: 'scheduled',
        location: formData.location,
        contactPerson: formData.contactPerson,
        objective: formData.objective,
        agenda: formData.agenda ? formData.agenda.split('\n').filter(item => item.trim()) : [],
        materials: formData.materials,
        travelMode: formData.travelMode,
        travelTime: formData.travelTime,
        expenses: formData.expenses ? `₹${formData.expenses}` : '₹0',
        accommodation: formData.accommodation === 'yes' ? 'Required' : 'Not Required',
        followUpDate: formData.followUpDate,
        followUpAction: formData.followUpAction,
        assignedTo: formData.assignedTo || 'Unassigned'
      };
      
      alert('Visit scheduled successfully!');
      showScreen('visits');
      
      // Reset form
      this.reset();
      // Re-auto-generate date/time for next entry
      autoGenerateVisitDateTime();
    });
  }

  if (cancelVisitBtn) {
    cancelVisitBtn.addEventListener('click', () => {
      showScreen('dashboard');
    });
  }

  // Helper function to get customer name by ID
  function getCustomerNameById(customerId) {
    if (!customerId) return 'Unknown Customer';
    
    // Check mock data customers
    const customer = Object.values(mockData.customers).find(c => 
      c.id === customerId || c.name === customerId
    );
    
    if (customer) return customer.name;
    
    // Fallback mapping
    const mapping = {
      '1': 'Acme Corporation',
      '2': 'Global Tech Solutions',
      '3': 'Tech Innovations Inc',
      'acme': 'Acme Corporation',
      'global': 'Global Tech Solutions',
      'tech': 'Tech Innovations Inc'
    };
    
    return mapping[customerId.toLowerCase()] || 'Unknown Customer';
  }

  // Helper function to calculate duration
  function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 'N/A';
    
    try {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diff = (end - start) / (1000 * 60); // difference in minutes
      
      if (diff < 60) {
        return `${diff} min`;
      } else {
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
      }
    } catch (e) {
      return 'N/A';
    }
  }

  // Helper function to add uploaded file to list
  function addUploadedFile(file, container) {
    if (!container) return;
    
    const fileElement = document.createElement('div');
    fileElement.className = 'uploaded-file-item';
    
    const fileIcon = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    
    fileElement.innerHTML = `
      <div class="file-icon">${fileIcon}</div>
      <div class="file-info">
        <p class="file-name">${file.name}</p>
        <span class="file-size">${fileSize}</span>
      </div>
      <button class="remove-file-btn" type="button">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add remove functionality
    const removeBtn = fileElement.querySelector('.remove-file-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        fileElement.remove();
      });
    }
    
    container.appendChild(fileElement);
  }

  // Helper function to get file icon based on extension
  function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf':
        return '<i class="fas fa-file-pdf"></i>';
      case 'doc':
      case 'docx':
        return '<i class="fas fa-file-word"></i>';
      case 'xls':
      case 'xlsx':
        return '<i class="fas fa-file-excel"></i>';
      case 'ppt':
      case 'pptx':
        return '<i class="fas fa-file-powerpoint"></i>';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '<i class="fas fa-file-image"></i>';
      default:
        return '<i class="fas fa-file"></i>';
    }
  }

  // Helper function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Helper function to get related lead name
  function getRelatedLeadName(relatedTo) {
    if (!relatedTo) return null;
    
    const mapping = {
      'lead-1': 'John Smith - Tech Innovations',
      'lead-2': 'Sarah Johnson - Digital Solutions',
      'opp-1': 'Enterprise Software License',
      'opp-2': 'Cloud Migration Project'
    };
    
    return mapping[relatedTo] || null;
  }

  // ========== SALES TARGET FUNCTIONALITY ==========
  // ... [Keep all existing sales target code] ...
  
  // ========== MOCK DATA ==========
  const mockData = {
    leads: {
      '1': {
        name: 'John Smith',
        company: 'Tech Innovations Inc',
        status: 'Hot',
        contactNumber: '+91 98765 43210',
        region: 'North India',
        industry: 'Technology',
        division: 'Enterprise Division',
        product: 'Enterprise Suite',
        brand: 'TechBrand',
        assignedTo: 'Rahul Kumar',
        lastContact: '2024-03-15',
        tags: ['Enterprise', 'Q1 Priority', 'Decision Maker'],
        initials: 'JS',
        agency: 'Digital Marketing Agency',
        clientContact: 'john@techinnovations.com',
        clientProduct: 'CRM Software',
        rollingMonth: 'March 2024',
        source: 'Website',
        subDivision: 'Enterprise Sales'
      },
      '2': {
        name: 'Sarah Johnson',
        company: 'Digital Solutions',
        status: 'Warm',
        contactNumber: '+91 98765 43211',
        region: 'West India',
        industry: 'Digital Services',
        division: 'Digital Division',
        product: 'Marketing Suite',
        brand: 'DigitalBrand',
        assignedTo: 'Priya Sharma',
        lastContact: '2024-03-14',
        tags: ['SMB', 'Marketing'],
        initials: 'SJ',
        agency: 'Web Solutions Agency',
        clientContact: 'sarah@digitalsolutions.com',
        clientProduct: 'E-commerce Platform',
        rollingMonth: 'March 2024',
        source: 'Referral',
        subDivision: 'Digital Marketing'
      }
    },
    tasks: {
      '1': {
        title: 'Follow up with ABC Corp',
        description: 'Call John Smith to discuss the enterprise license proposal. Make sure to address their concerns about pricing and implementation timeline.',
        priority: 'High',
        time: '10:00 AM',
        assignedTo: 'Rahul Kumar',
        dueDate: '2024-03-18',
        relatedLead: 'John Smith - Tech Innovations'
      },
      '2': {
        title: 'Prepare proposal for XYZ Ltd',
        description: 'Create comprehensive proposal including pricing, timeline, and implementation plan.',
        priority: 'Medium',
        time: '11:30 AM',
        assignedTo: 'Priya Sharma',
        dueDate: '2024-03-19',
        relatedLead: 'Sarah Johnson - Digital Solutions'
      }
    },
    opportunities: {
      '1': {
        title: 'Enterprise Software License',
        company: 'ABC Corporation',
        stage: 'Negotiation',
        value: '₹12.5L',
        probability: 80,
        expectedClose: '2024-04-15',
        owner: 'Rahul Kumar',
        description: 'Full enterprise license for 500 users including premium support and training.',
        division: 'Enterprise Division',
        region: 'North India',
        product: 'Enterprise Suite',
        brand: 'TechBrand',
        industry: 'Technology',
        agency: 'Digital Solutions Agency',
        clientContact: 'james@abccorp.com',
        clientProduct: 'Business Software',
        rollingMonth: 'April 2024',
        source: 'Referral',
        subDivision: 'Enterprise Sales'
      },
      '2': {
        title: 'Cloud Migration Project',
        company: 'XYZ Ltd',
        stage: 'Proposal',
        value: '₹8.3L',
        probability: 60,
        expectedClose: '2024-04-30',
        owner: 'Priya Sharma',
        description: 'Complete cloud migration and infrastructure setup.',
        division: 'Cloud Division',
        region: 'South India',
        product: 'Cloud Services',
        brand: 'CloudBrand',
        industry: 'Technology',
        agency: 'IT Solutions Agency',
        clientContact: 'mike@xyz.com',
        clientProduct: 'Infrastructure Services',
        rollingMonth: 'April 2024',
        source: 'Website',
        subDivision: 'Cloud Solutions'
      }
    },
    proposals: {
      '1': {
        title: 'Q1 Marketing Campaign',
        company: 'Brand Masters',
        status: 'pending',
        value: '₹9.5L',
        validUntil: '2024-04-01',
        owner: 'Rahul Kumar',
        description: 'Comprehensive digital marketing campaign including SEO, PPC, and social media management for Q1 2024.'
      },
      '2': {
        title: 'Website Redesign',
        company: 'Digital First',
        status: 'approved',
        value: '₹7.2L',
        validUntil: '2024-04-15',
        owner: 'Priya Sharma',
        description: 'Complete website redesign with modern UI/UX and responsive design.'
      }
    },
    customers: {
      '1': {
        name: 'Acme Corporation',
        contact: 'James Wilson',
        email: 'james@acme.com',
        phone: '+91 98765 43210',
        location: 'Mumbai',
        value: '₹45.2L',
        initials: 'AC',
        since: 'Jan 2022',
        status: 'active'
      },
      '2': {
        name: 'Global Tech Solutions',
        contact: 'Lisa Anderson',
        email: 'lisa@globaltech.com',
        phone: '+91 98765 43211',
        location: 'Bangalore',
        value: '₹38.5L',
        initials: 'GT',
        since: 'Mar 2021',
        status: 'active'
      },
      '3': {
        name: 'Tech Innovations Inc',
        contact: 'John Smith',
        email: 'john@techinnovations.com',
        phone: '+91 98765 43212',
        location: 'Delhi',
        value: '₹25.7L',
        initials: 'TI',
        since: 'Feb 2023',
        status: 'active'
      }
    },
    complaints: {
      '1': {
        title: 'Software Login Issues',
        customer: 'Acme Corporation',
        type: 'Technical',
        priority: 'high',
        status: 'investigating',
        createdAt: '2024-03-15',
        assignedTo: 'Tech Support',
        description: 'Multiple users at Acme Corporation are unable to access the system. Getting "Invalid credentials" error.',
        contactPerson: 'John Manager',
        contactEmail: 'john@acme.com',
        contactPhone: '+91 98765 43210'
      },
      '2': {
        title: 'Invoice Discrepancy',
        customer: 'Global Tech Solutions',
        type: 'Billing',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-03-14',
        assignedTo: 'Finance Team',
        description: 'Billing amount doesn\'t match the signed agreement.',
        contactPerson: 'Lisa Anderson',
        contactEmail: 'lisa@globaltech.com',
        contactPhone: '+91 98765 43211'
      }
    },
    visits: {
      '1': {
        id: 1,
        title: 'Quarterly Business Review',
        customer: 'Acme Corporation',
        description: 'Discuss Q1 performance and Q2 roadmap',
        date: '2024-03-18',
        time: '10:00 AM - 11:30 AM',
        duration: '1.5 hours',
        priority: 'high',
        status: 'scheduled',
        location: '123 Business St, Mumbai',
        contactPerson: 'James Wilson',
        objective: 'Discuss Q1 performance metrics and plan Q2 strategic initiatives. Review customer feedback and identify upsell opportunities.',
        agenda: ['Review Q1 performance metrics (30 mins)', 'Discuss customer feedback (20 mins)', 'Q2 roadmap presentation (30 mins)', 'Identify upsell opportunities (10 mins)'],
        materials: 'Laptop, presentation slides, sample reports, proposal documents.',
        travelMode: 'Car',
        travelTime: '2 hours',
        expenses: '₹1,500',
        accommodation: 'Not Required',
        followUpDate: '2024-03-25',
        followUpAction: 'Send Proposal',
        assignedTo: 'Rahul Kumar'
      },
      '2': {
        id: 2,
        title: 'Product Demo',
        customer: 'Tech Solutions Ltd',
        description: 'Demo of new enterprise features',
        date: '2024-03-18',
        time: '2:00 PM - 3:00 PM',
        duration: '1 hour',
        priority: 'medium',
        status: 'scheduled',
        location: '456 Tech Park, Bangalore',
        contactPerson: 'Mike Chen',
        objective: 'Demonstrate new enterprise features and gather feedback for improvements.',
        agenda: ['Product overview (15 mins)', 'Feature demonstration (30 mins)', 'Q&A session (15 mins)'],
        materials: 'Laptop, demo equipment, brochures.',
        travelMode: 'Flight',
        travelTime: '4 hours',
        expenses: '₹8,000',
        accommodation: 'Required',
        followUpDate: '2024-03-20',
        followUpAction: 'Schedule Call',
        assignedTo: 'Priya Sharma'
      },
      '3': {
        id: 3,
        title: 'Contract Renewal Meeting',
        customer: 'Global Enterprises',
        description: 'Annual contract renewal discussion',
        date: '2024-03-18',
        time: '11:00 AM - 12:30 PM',
        duration: '1.5 hours',
        priority: 'high',
        status: 'in-progress',
        location: '789 Corporate Ave, Delhi',
        contactPerson: 'Lisa Anderson',
        objective: 'Discuss contract renewal terms and negotiate pricing for the next year.',
        agenda: ['Current contract review (30 mins)', 'Performance evaluation (20 mins)', 'Renewal terms discussion (40 mins)'],
        materials: 'Contract documents, performance reports, pricing sheets.',
        travelMode: 'Train',
        travelTime: '3 hours',
        expenses: '₹2,500',
        accommodation: 'Not Required',
        followUpDate: '2024-03-22',
        followUpAction: 'Send Quote',
        assignedTo: 'Rahul Kumar'
      }
    },
    insights: [
      {
        id: 1,
        type: "opportunity",
        title: "Upsell Opportunity Detected",
        description: "ABC Corp's usage has increased 40%. Consider proposing premium tier upgrade.",
        impact: "high"
      },
      {
        id: 2,
        type: "action",
        title: "Follow-up Recommended",
        description: "3 leads haven't been contacted in 7 days. Schedule follow-up calls.",
        impact: "high"
      },
      {
        id: 3,
        type: "trend",
        title: "Sales Trend Alert",
        description: "Q1 sales up by 25% compared to last year. Great work!",
        impact: "medium"
      },
      {
        id: 4,
        type: "warning",
        title: "Customer Satisfaction Drop",
        description: "Customer satisfaction decreased by 10% this month. Review recent complaints.",
        impact: "high"
      }
    ],
    plannerEvents: [
      {
        id: 1,
        title: "Discovery Call with ABC Corp",
        type: "call",
        time: "09:00 AM",
        duration: "30 min",
        attendees: ["John Smith"]
      },
      {
        id: 2,
        title: "Product Demo - XYZ Ltd",
        type: "video",
        time: "10:30 AM",
        duration: "1 hour",
        attendees: ["Sarah Johnson", "Mike Chen"]
      },
      {
        id: 3,
        title: "Team Meeting",
        type: "meeting",
        time: "02:00 PM",
        duration: "1 hour",
        attendees: ["Sales Team"]
      }
    ]
  };

  // ========== DETAIL PAGE NAVIGATION ==========
  // Lead Cards
  document.querySelectorAll('.lead-card').forEach(leadCard => {
    leadCard.addEventListener('click', function(e) {
      if (!e.target.closest('.icon-btn') && !e.target.closest('.task-checkbox')) {
        const leadId = this.getAttribute('data-lead-id') || '1';
        loadLeadDetail(leadId);
        showScreen('leadDetail');
      }
    });
  });

  // Task Items
  document.querySelectorAll('.task-item').forEach(taskItem => {
    taskItem.addEventListener('click', function(e) {
      if (!e.target.closest('.task-checkbox input')) {
        const taskId = this.getAttribute('data-task-id') || '1';
        loadTaskDetail(taskId);
        showScreen('taskDetail');
      }
    });
  });

  // Opportunity Cards
  document.querySelectorAll('.opportunity-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const opportunityId = this.getAttribute('data-opportunity-id') || '1';
      loadOpportunityDetail(opportunityId);
      showScreen('opportunityDetail');
    });
  });

  // Proposal Cards
  document.querySelectorAll('.proposal-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const proposalId = this.getAttribute('data-proposal-id') || '1';
      loadProposalDetail(proposalId);
      showScreen('proposalDetail');
    });
  });

  // Customer Cards
  document.querySelectorAll('.customer-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const customerId = this.getAttribute('data-customer-id') || '1';
      loadCustomerDetail(customerId);
      showScreen('customerDetail');
    });
  });

  // Complaint Cards
  document.querySelectorAll('.complaint-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const complaintId = this.getAttribute('data-complaint-id') || '1';
      loadComplaintDetail(complaintId);
      showScreen('complaintDetail');
    });
  });

  // Visit Cards
  document.querySelectorAll('.visit-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (!e.target.closest('.icon-btn')) {
        const visitId = this.getAttribute('data-visit-id') || '1';
        loadVisitDetail(visitId);
        showScreen('visitDetail');
      }
    });
  });

  // ========== DETAIL PAGE LOADERS ==========
  function loadLeadDetail(leadId) {
    const data = mockData.leads[leadId] || mockData.leads['1'];
    
    // Update UI elements
    const nameEl = document.getElementById('leadDetailName');
    const companyEl = document.getElementById('leadDetailCompany');
    const statusEl = document.getElementById('leadDetailStatus');
    const leadNameEl = document.getElementById('leadDetailLeadName');
    const clientEl = document.getElementById('leadDetailClient');
    const contactEl = document.getElementById('leadDetailContactNumber');
    const regionEl = document.getElementById('leadDetailRegion');
    const industryEl = document.getElementById('leadDetailIndustry');
    const assignedEl = document.getElementById('leadDetailAssignedTo');
    const divisionEl = document.getElementById('leadDetailDivision');
    const productEl = document.getElementById('leadDetailProduct');
    const brandEl = document.getElementById('leadDetailBrand');
    const avatarEl = document.getElementById('leadDetailAvatar');
    const agencyEl = document.getElementById('leadDetailAgency');
    const clientContactEl = document.getElementById('leadDetailClientContact');
    const clientProductEl = document.getElementById('leadDetailClientProduct');
    const rollingMonthEl = document.getElementById('leadDetailRollingMonth');
    const sourceEl = document.getElementById('leadDetailSource');
    const subDivisionEl = document.getElementById('leadDetailSubDivision');
    
    if (nameEl) nameEl.textContent = data.name;
    if (companyEl) companyEl.textContent = data.company;
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `lead-badge ${data.status.toLowerCase()}`;
    }
    if (leadNameEl) leadNameEl.textContent = data.name;
    if (clientEl) clientEl.textContent = data.company;
    if (contactEl) contactEl.textContent = data.contactNumber;
    if (regionEl) regionEl.textContent = data.region;
    if (industryEl) industryEl.textContent = data.industry;
    if (assignedEl) assignedEl.textContent = data.assignedTo;
    if (divisionEl) divisionEl.textContent = data.division;
    if (productEl) productEl.textContent = data.product;
    if (brandEl) brandEl.textContent = data.brand;
    if (avatarEl) avatarEl.textContent = data.initials;
    if (agencyEl) agencyEl.textContent = data.agency;
    if (clientContactEl) clientContactEl.textContent = data.clientContact;
    if (clientProductEl) clientProductEl.textContent = data.clientProduct;
    if (rollingMonthEl) rollingMonthEl.textContent = data.rollingMonth;
    if (sourceEl) sourceEl.textContent = data.source;
    if (subDivisionEl) subDivisionEl.textContent = data.subDivision;
  }

  function loadOpportunityDetail(opportunityId) {
    const data = mockData.opportunities[opportunityId] || mockData.opportunities['1'];
    
    const titleEl = document.getElementById('opportunityDetailTitle');
    const companyEl = document.getElementById('opportunityDetailCompany');
    const stageEl = document.getElementById('opportunityDetailStage');
    const valueEl = document.getElementById('opportunityDetailValue');
    const probEl = document.getElementById('opportunityDetailProbability');
    const ownerEl = document.getElementById('opportunityDetailOwner');
    const descEl = document.getElementById('opportunityDetailDescription');
    const progressEl = document.getElementById('opportunityProgressBar');
    const revenueEl = document.getElementById('opportunityDetailExpectedRevenue');
    const divisionEl = document.getElementById('opportunityDetailDivision');
    const regionEl = document.getElementById('opportunityDetailRegion');
    const productEl = document.getElementById('opportunityDetailProduct');
    const brandEl = document.getElementById('opportunityDetailBrand');
    const industryEl = document.getElementById('opportunityDetailIndustry');
    const agencyEl = document.getElementById('opportunityDetailAgency');
    const clientContactEl = document.getElementById('opportunityDetailClientContact');
    const clientProductEl = document.getElementById('opportunityDetailClientProduct');
    const rollingMonthEl = document.getElementById('opportunityDetailRollingMonth');
    const sourceEl = document.getElementById('opportunityDetailSource');
    const subDivisionEl = document.getElementById('opportunityDetailSubDivision');
    
    if (titleEl) titleEl.textContent = data.title;
    if (companyEl) companyEl.textContent = data.company;
    if (stageEl) {
      stageEl.textContent = data.stage;
      stageEl.className = `opportunity-badge ${data.stage.toLowerCase().replace(' ', '-')}`;
    }
    if (valueEl) valueEl.textContent = data.value;
    if (probEl) {
      probEl.textContent = `${data.probability}%`;
    }
    if (ownerEl) ownerEl.textContent = data.owner;
    if (descEl) descEl.textContent = data.description;
    if (progressEl) {
      progressEl.style.width = `${data.probability}%`;
    }
    if (revenueEl) revenueEl.innerHTML = `Expected Revenue: <strong>${data.value}</strong>`;
    if (divisionEl) divisionEl.textContent = data.division;
    if (regionEl) regionEl.textContent = data.region;
    if (productEl) productEl.textContent = data.product;
    if (brandEl) brandEl.textContent = data.brand;
    if (industryEl) industryEl.textContent = data.industry;
    if (agencyEl) agencyEl.textContent = data.agency;
    if (clientContactEl) clientContactEl.textContent = data.clientContact;
    if (clientProductEl) clientProductEl.textContent = data.clientProduct;
    if (rollingMonthEl) rollingMonthEl.textContent = data.rollingMonth;
    if (sourceEl) sourceEl.textContent = data.source;
    if (subDivisionEl) subDivisionEl.textContent = data.subDivision;
  } 

  function loadTaskDetail(taskId) {
    const data = mockData.tasks[taskId] || mockData.tasks['1'];
    
    const titleEl = document.getElementById('taskDetailTitle');
    const descEl = document.getElementById('taskDetailDescription');
    const priorityEl = document.getElementById('taskDetailPriority');
    const timeEl = document.getElementById('taskDetailTime');
    const assignedEl = document.getElementById('taskDetailAssignedTo');
    const dueDateEl = document.getElementById('taskDetailDueDate');
    const dateEl = document.getElementById('taskDetailDate');
    const relatedEl = document.getElementById('taskDetailRelatedLead');
    
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.description;
    if (priorityEl) {
      priorityEl.textContent = data.priority;
      priorityEl.className = `task-badge ${data.priority.toLowerCase()}`;
    }
    if (timeEl) timeEl.textContent = data.time;
    if (assignedEl) assignedEl.textContent = data.assignedTo;
    if (dueDateEl) dueDateEl.textContent = data.dueDate;
    if (dateEl) dateEl.textContent = `Due ${data.dueDate}`;
    if (relatedEl) relatedEl.textContent = data.relatedLead;
  }

  function loadProposalDetail(proposalId) {
    const data = mockData.proposals[proposalId] || mockData.proposals['1'];
    
    const titleEl = document.getElementById('proposalDetailTitle');
    const companyEl = document.getElementById('proposalDetailCompany');
    const statusEl = document.getElementById('proposalDetailStatus');
    const valueEl = document.getElementById('proposalDetailValue');
    const probEl = document.getElementById('proposalDetailProbability');
    const clientEl = document.getElementById('proposalDetailClient');
    const agencyEl = document.getElementById('proposalDetailAgency');
    const ownerEl = document.getElementById('proposalDetailOwner');
    const descEl = document.getElementById('proposalDetailDescription');
    const divisionEl = document.getElementById('proposalDetailDivision');
    const regionEl = document.getElementById('proposalDetailRegion');
    const productEl = document.getElementById('proposalDetailProduct');
    const brandEl = document.getElementById('proposalDetailBrand');
    const industryEl = document.getElementById('proposalDetailIndustry');
    const clientContactEl = document.getElementById('proposalDetailClientContact');
    const clientProductEl = document.getElementById('proposalDetailClientProduct');
    const rollingMonthEl = document.getElementById('proposalDetailRollingMonth');
    const sourceEl = document.getElementById('proposalDetailSource');
    const subDivisionEl = document.getElementById('proposalDetailSubDivision');
    const progressEl = document.getElementById('proposalProgressBar');
    
    if (titleEl) titleEl.textContent = data.title;
    if (companyEl) companyEl.textContent = data.company;
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `proposal-badge ${data.status}`;
    }
    if (valueEl) valueEl.textContent = data.value;
    if (probEl) probEl.textContent = `${data.probability || '75'}% probability`;
    if (clientEl) clientEl.textContent = data.client || data.company;
    if (agencyEl) agencyEl.textContent = data.agency || 'No agency';
    if (ownerEl) ownerEl.textContent = data.owner;
    if (descEl) descEl.textContent = data.description;
    if (divisionEl) divisionEl.textContent = data.division || 'Not specified';
    if (regionEl) regionEl.textContent = data.region || 'Not specified';
    if (productEl) productEl.textContent = data.product || 'Not specified';
    if (brandEl) brandEl.textContent = data.brand || 'Not specified';
    if (industryEl) industryEl.textContent = data.industry || 'Not specified';
    if (clientContactEl) clientContactEl.textContent = data.clientContact || 'Not specified';
    if (clientProductEl) clientProductEl.textContent = data.clientProduct || 'Not specified';
    if (rollingMonthEl) rollingMonthEl.textContent = data.rollingMonth || 'Not specified';
    if (sourceEl) sourceEl.textContent = data.source || 'Not specified';
    if (subDivisionEl) subDivisionEl.textContent = data.subDivision || 'Not specified';
    if (progressEl) {
      progressEl.style.width = `${data.probability || 75}%`;
    }
  }

  function loadCustomerDetail(customerId) {
    const data = mockData.customers[customerId] || mockData.customers['1'];
    
    const nameEl = document.getElementById('customerDetailName');
    const contactEl = document.getElementById('customerDetailContact');
    const emailEl = document.getElementById('customerDetailEmail');
    const phoneEl = document.getElementById('customerDetailPhone');
    const locationEl = document.getElementById('customerDetailLocation');
    const valueEl = document.getElementById('customerDetailValue');
    const sinceEl = document.getElementById('customerDetailSince');
    const statusEl = document.getElementById('customerDetailStatus');
    const avatarEl = document.getElementById('customerDetailAvatar');
    
    if (nameEl) nameEl.textContent = data.name;
    if (contactEl) contactEl.textContent = data.contact;
    if (emailEl) emailEl.textContent = data.email;
    if (phoneEl) phoneEl.textContent = data.phone;
    if (locationEl) locationEl.textContent = data.location;
    if (valueEl) valueEl.textContent = data.value;
    if (sinceEl) sinceEl.textContent = data.since;
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `customer-badge ${data.status}`;
    }
    if (avatarEl) avatarEl.textContent = data.initials;
  }

  function loadComplaintDetail(complaintId) {
    const data = mockData.complaints[complaintId] || mockData.complaints['1'];
    
    const titleEl = document.getElementById('complaintDetailTitle');
    const customerEl = document.getElementById('complaintDetailCustomer');
    const typeEl = document.getElementById('complaintDetailType');
    const priorityEl = document.getElementById('complaintDetailPriority');
    const statusEl = document.getElementById('complaintDetailStatus');
    const createdEl = document.getElementById('complaintDetailCreatedAt');
    const assignedEl = document.getElementById('complaintDetailAssignedTo');
    const descEl = document.getElementById('complaintDetailDescription');
    const contactPersonEl = document.getElementById('complaintDetailContactPerson');
    const contactEmailEl = document.getElementById('complaintDetailContactEmail');
    const contactPhoneEl = document.getElementById('complaintDetailContactPhone');
    
    if (titleEl) titleEl.textContent = data.title;
    if (customerEl) customerEl.textContent = data.customer;
    if (typeEl) typeEl.textContent = data.type;
    if (priorityEl) {
      priorityEl.textContent = data.priority;
      priorityEl.className = `complaint-priority-badge ${data.priority}`;
    }
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `complaint-status-badge ${data.status}`;
    }
    if (createdEl) createdEl.textContent = data.createdAt;
    if (assignedEl) assignedEl.textContent = data.assignedTo;
    if (descEl) descEl.textContent = data.description;
    if (contactPersonEl) contactPersonEl.textContent = data.contactPerson;
    if (contactEmailEl) contactEmailEl.textContent = data.contactEmail;
    if (contactPhoneEl) contactPhoneEl.textContent = data.contactPhone;
  }

  function loadVisitDetail(visitId) {
    currentVisitId = visitId; // Store current visit ID for end visit functionality
    const data = mockData.visits[visitId] || mockData.visits['1'];
    
    // Update UI elements
    const titleEl = document.getElementById('visitDetailTitle');
    const customerEl = document.getElementById('visitDetailCustomer');
    const typeEl = document.getElementById('visitDetailType');
    const priorityEl = document.getElementById('visitDetailPriority');
    const statusEl = document.getElementById('visitDetailStatus');
    const dateEl = document.getElementById('visitDetailDate');
    const timeEl = document.getElementById('visitDetailTime');
    const locationEl = document.getElementById('visitDetailLocation');
    const contactPersonEl = document.getElementById('visitDetailContactPerson');
    const contactPhoneEl = document.getElementById('visitDetailContactPhone');
    const assignedEl = document.getElementById('visitDetailAssignedTo');
    const objectiveEl = document.getElementById('visitDetailObjective');
    const agendaEl = document.getElementById('visitDetailAgenda');
    const materialsEl = document.getElementById('visitDetailMaterials');
    const travelModeEl = document.getElementById('visitDetailTravelMode');
    const travelTimeEl = document.getElementById('visitDetailTravelTime');
    const expensesEl = document.getElementById('visitDetailExpenses');
    const accommodationEl = document.getElementById('visitDetailAccommodation');
    const followUpDateEl = document.getElementById('visitDetailFollowUpDate');
    const followUpActionEl = document.getElementById('visitDetailFollowUpAction');
    const descriptionEl = document.getElementById('visitDetailDescription');
    
    if (titleEl) titleEl.textContent = data.title;
    if (customerEl) customerEl.textContent = data.customer;
    if (typeEl) {
      const typeMapping = {
        'business-review': 'Business Review',
        'product-demo': 'Product Demo',
        'contract-renewal': 'Contract Meeting',
        'sales-meeting': 'Sales Meeting',
        'support-visit': 'Support Visit'
      };
      typeEl.textContent = typeMapping[data.type] || data.title.includes('Review') ? 'Business Review' : 
                          data.title.includes('Demo') ? 'Product Demo' : 
                          data.title.includes('Contract') ? 'Contract Meeting' : 'Sales Meeting';
    }
    if (priorityEl) {
      priorityEl.textContent = data.priority;
      priorityEl.className = `visit-priority-badge ${data.priority}`;
    }
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = `visit-status-badge ${data.status.replace('-', '')}`;
    }
    if (dateEl) dateEl.textContent = data.date;
    if (timeEl) timeEl.textContent = data.time;
    if (locationEl) locationEl.textContent = data.location;
    if (contactPersonEl) contactPersonEl.textContent = data.contactPerson;
    if (contactPhoneEl) contactPhoneEl.textContent = data.contactPhone || 'Not provided';
    if (assignedEl) assignedEl.textContent = data.assignedTo;
    if (objectiveEl) objectiveEl.textContent = data.objective || data.description;
    if (descriptionEl) descriptionEl.textContent = data.description;
    
    // Update agenda list
    if (agendaEl && data.agenda) {
      agendaEl.innerHTML = '';
      data.agenda.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        agendaEl.appendChild(li);
      });
    }
    
    if (materialsEl) materialsEl.textContent = data.materials || 'Not specified';
    if (travelModeEl) travelModeEl.textContent = data.travelMode || 'Not specified';
    if (travelTimeEl) travelTimeEl.textContent = data.travelTime || 'Not specified';
    if (expensesEl) expensesEl.textContent = data.expenses || '₹0';
    if (accommodationEl) accommodationEl.textContent = data.accommodation || 'Not Required';
    if (followUpDateEl) followUpDateEl.textContent = data.followUpDate || 'Not scheduled';
    if (followUpActionEl) followUpActionEl.textContent = data.followUpAction || 'No follow-up';
    
    // Set active status button
    document.querySelectorAll('#visitDetailScreen .status-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.status === data.status) {
        btn.classList.add('active');
      }
    });
    
    // Initialize status buttons for this visit
    initVisitStatusButtons();
    
    // Update end visit button visibility
    updateEndVisitButtonVisibility();
  }

  // ========== UPLOAD FUNCTIONALITY FOR DETAIL SCREENS ==========
  // Lead Detail Upload
  const leadUploadBtn = document.getElementById('leadUploadBtn');
  const leadFileInput = document.getElementById('leadFileInput');
  const leadUploadedFiles = document.getElementById('leadUploadedFiles');

  if (leadUploadBtn && leadFileInput) {
    leadUploadBtn.addEventListener('click', () => {
      leadFileInput.click();
    });

    leadFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        addUploadedFile(file, leadUploadedFiles);
      });
    });
  }

  // Opportunity Detail Upload
  const opportunityUploadBtn = document.getElementById('opportunityUploadBtn');
  const opportunityFileInput = document.getElementById('opportunityFileInput');
  const opportunityUploadedFiles = document.getElementById('opportunityUploadedFiles');

  if (opportunityUploadBtn && opportunityFileInput) {
    opportunityUploadBtn.addEventListener('click', () => {
      opportunityFileInput.click();
    });

    opportunityFileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        addUploadedFile(file, opportunityUploadedFiles);
      });
    });
  }

  // ========== ADD TASK BUTTONS ==========
  const addTaskForLeadBtn = document.getElementById('addTaskForLeadBtn');
  const addTaskForOpportunityBtn = document.getElementById('addTaskForOpportunityBtn');

  if (addTaskForLeadBtn) {
    addTaskForLeadBtn.addEventListener('click', () => {
      showScreen('taskForm');
    });
  }

  if (addTaskForOpportunityBtn) {
    addTaskForOpportunityBtn.addEventListener('click', () => {
      showScreen('taskForm');
    });
  }

  // ========== INSIGHTS/IDEAS ==========
  function loadInsights() {
    const insightsContainer = document.getElementById('insightsList');
    if (!insightsContainer) return;
    
    insightsContainer.innerHTML = '';
    
    mockData.insights.forEach(insight => {
      const insightElement = document.createElement('div');
      insightElement.className = 'insight-card';
      
      let icon = '✨';
      let iconClass = 'insight-opportunity';
      
      switch(insight.type) {
        case 'opportunity':
          icon = '📈';
          iconClass = 'insight-opportunity';
          break;
        case 'action':
          icon = '🎯';
          iconClass = 'insight-action';
          break;
        case 'trend':
          icon = '📊';
          iconClass = 'insight-trend';
          break;
        case 'warning':
          icon = '⚠️';
          iconClass = 'insight-warning';
          break;
      }
      
      insightElement.innerHTML = `
        <div class="insight-icon ${iconClass}">
          ${icon}
        </div>
        <div class="insight-content">
          <div class="insight-header">
            <h4>${insight.title}</h4>
            <span class="insight-impact insight-impact-${insight.impact}">${insight.impact}</span>
          </div>
          <p>${insight.description}</p>
        </div>
      `;
      
      insightsContainer.appendChild(insightElement);
    });
  }

  // View Insights Button
  const viewInsightsBtn = document.getElementById('viewInsightsBtn');
  if (viewInsightsBtn) {
    viewInsightsBtn.addEventListener('click', () => {
      loadInsights();
      showScreen('ideas');
    });
  }

  // ========== PLANNER ==========
  function loadPlannerEvents() {
    const eventsContainer = document.getElementById('plannerEvents');
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = '';
    
    if (mockData.plannerEvents && mockData.plannerEvents.length > 0) {
      mockData.plannerEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'planner-event';
        
        let icon = '📍';
        let iconClass = 'event-type-meeting';
        
        switch(event.type) {
          case 'call':
            icon = '📞';
            iconClass = 'event-type-call';
            break;
          case 'video':
            icon = '🎥';
            iconClass = 'event-type-video';
            break;
          case 'meeting':
            icon = '📍';
            iconClass = 'event-type-meeting';
            break;
          case 'task':
            icon = '✓';
            iconClass = 'event-type-task';
            break;
          case 'visit':
            icon = '📍';
            iconClass = 'event-type-meeting';
            break;
        }
        
        eventElement.innerHTML = `
          <div class="event-type ${iconClass}">
            ${icon}
          </div>
          <div class="event-content">
            <div class="event-header">
              <h4>${event.title}</h4>
              <span class="event-badge">${event.type}</span>
            </div>
            <div class="event-details">
              <span>⏰ ${event.time} (${event.duration})</span>
              ${event.attendees ? `<span>👥 ${event.attendees.join(', ')}</span>` : ''}
              ${event.location ? `<span>📍 ${event.location}</span>` : ''}
            </div>
          </div>
        `;
        
        eventsContainer.appendChild(eventElement);
      });
    } else {
      eventsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <h4>No events scheduled</h4>
          <p>Tap the "+ Add Event" button to schedule your first event.</p>
        </div>
      `;
    }
  }

  // Calendar Navigation
  const todayBtn = document.getElementById('todayBtn');
  const prevWeekBtn = document.getElementById('prevWeekBtn');
  const nextWeekBtn = document.getElementById('nextWeekBtn');

  let currentDate = new Date();

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      currentDate = new Date();
      updateCalendar(currentDate);
    });
  }

  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() - 7);
      updateCalendar(currentDate);
    });
  }

  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() + 7);
      updateCalendar(currentDate);
    });
  }

  function updateCalendar(date) {
    const dateElements = document.querySelectorAll('.calendar-date');
    const today = new Date();
    
    // Calculate start of week (Sunday)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    dateElements.forEach((element, index) => {
      element.classList.remove('today', 'selected');
      
      // Calculate date for this calendar cell
      const cellDate = new Date(startOfWeek);
      cellDate.setDate(startOfWeek.getDate() + index);
      
      // Update day number
      const dayNumberEl = element.querySelector('.day-number');
      if (dayNumberEl) {
        dayNumberEl.textContent = cellDate.getDate();
      }
      
      // Update day name
      const dayNameEl = element.querySelector('.day-name');
      if (dayNameEl) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNameEl.textContent = dayNames[cellDate.getDay()];
      }
      
      // Check if today
      if (cellDate.toDateString() === today.toDateString()) {
        element.classList.add('today');
      }
      
      // Check if selected (same as the date we're viewing)
      if (cellDate.toDateString() === date.toDateString()) {
        element.classList.add('selected');
      }
      
      // Make calendar dates clickable
      element.onclick = () => {
        currentDate = new Date(cellDate);
        updateCalendar(currentDate);
      };
    });
  }

  // ========== VISITS FUNCTIONALITY ==========
  function loadVisitsData() {
    // Load visits data from mock data
    const visitsList = document.querySelector('#visitsScreen .leads-list');
    if (!visitsList) return;
    
    // Clear existing visits except the first few (if they exist)
    const existingVisits = visitsList.querySelectorAll('.visit-card');
    if (existingVisits.length > 3) {
      for (let i = 3; i < existingVisits.length; i++) {
        existingVisits[i].remove();
      }
    }
    
    // Add visits from mock data
    Object.values(mockData.visits).forEach(visit => {
      // Check if visit already exists
      const existingVisit = visitsList.querySelector(`.visit-card[data-visit-id="${visit.id}"]`);
      if (existingVisit) return;
      
      const visitCard = document.createElement('div');
      visitCard.className = 'visit-card';
      visitCard.setAttribute('data-visit-id', visit.id || '1');
      visitCard.setAttribute('data-status', visit.status);
      visitCard.setAttribute('data-priority', visit.priority);
      
      let iconClass = 'purple';
      if (visit.priority === 'high') iconClass = 'orange';
      if (visit.priority === 'medium') iconClass = 'blue';
      
      let statusClass = 'scheduled';
      if (visit.status === 'in-progress') statusClass = 'in-progress';
      if (visit.status === 'completed') statusClass = 'completed';
      
      visitCard.innerHTML = `
        <div class="visit-icon">
          <div class="icon-box ${iconClass}">📍</div>
        </div>
        <div class="visit-info">
          <div class="visit-header">
            <h4 class="visit-title">${visit.title}</h4>
            <div class="visit-badges">
              <span class="visit-priority-badge ${visit.priority}">${visit.priority}</span>
              <span class="visit-status-badge ${statusClass}">${visit.status}</span>
            </div>
          </div>
          <p class="visit-customer">${visit.customer}</p>
          <p class="visit-description">${visit.description}</p>
          <div class="visit-details">
            <span class="visit-time">⏰ ${visit.time} (${visit.duration})</span>
            <span class="visit-date">📅 ${visit.date}</span>
          </div>
          <div class="visit-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${visit.location}</span>
          </div>
        </div>
      `;
      
      visitsList.appendChild(visitCard);
    });
    
    // Re-attach click events
    document.querySelectorAll('#visitsScreen .visit-card').forEach(card => {
      card.addEventListener('click', function(e) {
        if (!e.target.closest('.icon-btn')) {
          const visitId = this.getAttribute('data-visit-id') || '1';
          loadVisitDetail(visitId);
          showScreen('visitDetail');
        }
      });
    });
  }

  // ========== SEARCH FUNCTIONALITY ==========
  const searchInputs = {
    main: document.getElementById('searchInput'),
    leads: document.getElementById('leadsSearch'),
    tasks: document.getElementById('tasksSearch'),
    opportunities: document.getElementById('opportunitiesSearch'),
    proposals: document.getElementById('proposalsSearch'),
    customers: document.getElementById('customersSearch'),
    complaints: document.getElementById('complaintsSearch'),
    ideas: document.getElementById('ideasSearch'),
    visits: document.getElementById('visitsSearch')
  };

  // Add search functionality
  Object.entries(searchInputs).forEach(([key, input]) => {
    if (input) {
      input.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        performSearch(query, key);
      });
    }
  });

  function performSearch(query, context) {
    let selector = '';
    
    switch(context) {
      case 'leads':
        selector = '.lead-card';
        break;
      case 'tasks':
        selector = '.task-item';
        break;
      case 'opportunities':
        selector = '.opportunity-card';
        break;
      case 'proposals':
        selector = '.proposal-card';
        break;
      case 'customers':
        selector = '.customer-card';
        break;
      case 'complaints':
        selector = '.complaint-card';
        break;
      case 'ideas':
        selector = '.insight-card';
        break;
      case 'visits':
        selector = '.visit-card';
        break;
      default:
        return;
    }
    
    const items = document.querySelectorAll(selector);
    if (items.length === 0) return;
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
  }

  // ========== FILTER FUNCTIONALITY ==========
  const filterButtons = {
    leads: document.getElementById('leadsFilterBtn'),
    tasks: document.getElementById('tasksFilterBtn'),
    opportunities: document.getElementById('opportunitiesFilterBtn'),
    proposals: document.getElementById('proposalsFilterBtn'),
    complaints: document.getElementById('complaintsFilterBtn'),
    visits: document.getElementById('visitsFilterBtn')
  };

  const filterPanels = {
    leads: document.getElementById('leadsFilterPanel'),
    tasks: document.getElementById('tasksFilterPanel'),
    opportunities: document.getElementById('opportunitiesFilterPanel'),
    proposals: document.getElementById('proposalsFilterPanel'),
    complaints: document.getElementById('complaintsFilterPanel'),
    visits: document.getElementById('visitsFilterPanel')
  };

  // Toggle filter panels
  Object.entries(filterButtons).forEach(([key, button]) => {
    const panel = filterPanels[key];
    if (button && panel) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other panels
        Object.values(filterPanels).forEach(p => {
          if (p && p !== panel) p.classList.add('hidden');
        });
        
        // Toggle current panel
        panel.classList.toggle('hidden');
      });
    }
  });

  // Close panels when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-btn') && !e.target.closest('.filter-panel')) {
      Object.values(filterPanels).forEach(panel => {
        if (panel) panel.classList.add('hidden');
      });
    }
  });

  // Filter options
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
      const filterGroup = this.closest('.filter-group');
      const allOptions = filterGroup.querySelectorAll('.filter-option');
      
      allOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      applyFilters();
    });
  });

  // Clear filters
  document.querySelectorAll('.clear-filters').forEach(button => {
    button.addEventListener('click', () => {
      const panel = button.closest('.filter-panel');
      if (panel) {
        panel.querySelectorAll('.filter-option').forEach(option => {
          if (option.dataset.value === 'all') {
            option.classList.add('active');
          } else {
            option.classList.remove('active');
          }
        });
        applyFilters();
      }
    });
  });

  function applyFilters() {
    // Get active filters
    const leadStatus = document.querySelector('#leadsFilterPanel [data-filter="status"].active')?.dataset.value;
    const taskPriority = document.querySelector('#tasksFilterPanel [data-filter="priority"].active')?.dataset.value;
    const oppStage = document.querySelector('#opportunitiesFilterPanel [data-filter="stage"].active')?.dataset.value;
    const propStatus = document.querySelector('#proposalsFilterPanel [data-filter="status"].active')?.dataset.value;
    const compPriority = document.querySelector('#complaintsFilterPanel [data-filter="priority"].active')?.dataset.value;
    const compStatus = document.querySelector('#complaintsFilterPanel [data-filter="status"].active')?.dataset.value;
    const visitStatus = document.querySelector('#visitsFilterPanel [data-filter="status"].active')?.dataset.value;
    const visitPriority = document.querySelector('#visitsFilterPanel [data-filter="priority"].active')?.dataset.value;

    // Apply lead filters
    if (leadStatus && leadStatus !== 'all') {
      document.querySelectorAll('.lead-card').forEach(card => {
        const cardStatus = card.dataset.status;
        card.style.display = cardStatus === leadStatus ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.lead-card').forEach(card => {
        card.style.display = '';
      });
    }

    // Apply task filters
    if (taskPriority && taskPriority !== 'all') {
      document.querySelectorAll('.task-item').forEach(task => {
        const cardPriority = task.dataset.priority;
        task.style.display = cardPriority === taskPriority ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.task-item').forEach(task => {
        task.style.display = '';
      });
    }

    // Apply opportunity filters
    if (oppStage && oppStage !== 'all') {
      document.querySelectorAll('.opportunity-card').forEach(card => {
        const cardStage = card.dataset.stage;
        card.style.display = cardStage === oppStage ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.opportunity-card').forEach(card => {
        card.style.display = '';
      });
    }

    // Apply proposal filters
    if (propStatus && propStatus !== 'all') {
      document.querySelectorAll('.proposal-card').forEach(card => {
        const cardStatus = card.dataset.status;
        card.style.display = cardStatus === propStatus ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.proposal-card').forEach(card => {
        card.style.display = '';
      });
    }

    // Apply complaint filters
    if ((compPriority && compPriority !== 'all') || (compStatus && compStatus !== 'all')) {
      document.querySelectorAll('.complaint-card').forEach(card => {
        const cardPriority = card.dataset.priority;
        const cardStatus = card.dataset.status;
        const priorityMatch = !compPriority || compPriority === 'all' || cardPriority === compPriority;
        const statusMatch = !compStatus || compStatus === 'all' || cardStatus === compStatus;
        card.style.display = priorityMatch && statusMatch ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.complaint-card').forEach(card => {
        card.style.display = '';
      });
    }

    // Apply visit filters
    if ((visitStatus && visitStatus !== 'all') || (visitPriority && visitPriority !== 'all')) {
      document.querySelectorAll('.visit-card').forEach(card => {
        const cardStatus = card.dataset.status;
        const cardPriority = card.dataset.priority;
        const statusMatch = !visitStatus || visitStatus === 'all' || cardStatus === visitStatus;
        const priorityMatch = !visitPriority || visitPriority === 'all' || cardPriority === visitPriority;
        card.style.display = statusMatch && priorityMatch ? '' : 'none';
      });
    } else {
      document.querySelectorAll('.visit-card').forEach(card => {
        card.style.display = '';
      });
    }
  }

  // ========== CHAT FUNCTIONALITY ==========
  const fabBtn = document.getElementById('fabBtn');
  const chatModal = document.getElementById('chatModal');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  // Open chat
  if (fabBtn && chatModal) {
    fabBtn.addEventListener('click', () => {
      chatModal.classList.remove('hidden');
    });
  }

  // Close chat
  if (closeChatBtn && chatModal) {
    closeChatBtn.addEventListener('click', () => {
      chatModal.classList.add('hidden');
    });
  }

  // Send message
  function sendMessage() {
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (message) {
      // Add user message
      addMessage('user', message);
      chatInput.value = '';
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "I understand. Let me check the lead status for you...",
          "Based on your sales data, I recommend following up with 3 leads today.",
          "I've scheduled a reminder for your important meeting tomorrow.",
          "Your sales target progress is at 90% - you're doing great!",
          "I can help you prepare a proposal. What information do you need?",
          "Looking at your opportunities, ABC Corp has an 80% chance of closing.",
          "You have 2 high-priority complaints that need attention today."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage('ai', randomResponse);
      }, 1000);
    }
  }

  // Send button
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendMessage);
  }

  // Enter key
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  function addMessage(sender, text) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${sender === 'ai' ? '🤖' : '👤'}</div>
      <div class="message-content">
        <p>${text}</p>
      </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ========== TASK CHECKBOXES ==========
  document.querySelectorAll('.task-checkbox input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskItem = this.closest('.task-item');
      if (this.checked) {
        taskItem.style.opacity = '0.7';
        const heading = taskItem.querySelector('h4');
        if (heading) heading.style.textDecoration = 'line-through';
      } else {
        taskItem.style.opacity = '1';
        const heading = taskItem.querySelector('h4');
        if (heading) heading.style.textDecoration = 'none';
      }
    });
  });

  // ========== TAB FUNCTIONALITY ==========
  document.querySelectorAll('.tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', function() {
      const tabContainer = this.closest('.detail-tabs');
      if (!tabContainer) return;
      
      // Update active tab button
      tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Get tab id
      const tabId = this.getAttribute('data-tab') || this.textContent.toLowerCase();
      
      // Show corresponding tab content
      tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id.includes(tabId)) {
          content.classList.add('active');
        }
      });
    });
  });

  // ========== EDIT BUTTONS ==========
  document.querySelectorAll('.edit-btn').forEach(editBtn => {
    editBtn.addEventListener('click', function() {
      alert('Edit functionality coming soon!');
    });
  });

  // ========== BOTTOM NAVIGATION ==========
  const navItems = {
    home: document.getElementById('navHome'),
    planner: document.getElementById('navPlanner'),
    ideas: document.getElementById('navIdeas'),
    settings: document.getElementById('navSettings')
  };

  // Home nav
  if (navItems.home) {
    navItems.home.addEventListener('click', () => {
      // Remove active from all
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      // Add active to home
      navItems.home.classList.add('active');
      showScreen('dashboard');
    });
  }

  // Planner nav
  if (navItems.planner) {
    navItems.planner.addEventListener('click', () => {
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      navItems.planner.classList.add('active');
      loadPlannerEvents();
      showScreen('planner');
    });
  }

  // Ideas nav
  if (navItems.ideas) {
    navItems.ideas.addEventListener('click', () => {
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      navItems.ideas.classList.add('active');
      loadInsights();
      showScreen('ideas');
    });
  }

  // Settings nav
  if (navItems.settings) {
    navItems.settings.addEventListener('click', () => {
      Object.values(navItems).forEach(item => {
        if (item) item.classList.remove('active');
      });
      navItems.settings.classList.add('active');
      alert('Settings screen coming soon!');
    });
  }

  // ========== CREATE BUTTONS INSIDE SCREENS ==========
  const createOpportunityFab = document.getElementById('createOpportunityBtn');
  if (createOpportunityFab) {
    createOpportunityFab.addEventListener('click', () => {
      showScreen('opportunityForm');
    });
  }

  const createProposalFab = document.getElementById('createProposalBtn');
  if (createProposalFab) {
    createProposalFab.addEventListener('click', () => {
      alert('Create Proposal functionality coming soon!');
    });
  }

  const createComplaintFab = document.getElementById('createComplaintBtn');
  if (createComplaintFab) {
    createComplaintFab.addEventListener('click', () => {
      alert('Create Complaint functionality coming soon!');
    });
  }

  const createCustomerFab = document.getElementById('createCustomerBtn');
  if (createCustomerFab) {
    createCustomerFab.addEventListener('click', () => {
      showScreen('customerForm');
    });
  }

  const scheduleVisitFab = document.getElementById('scheduleVisitFab');
  if (scheduleVisitFab) {
    scheduleVisitFab.addEventListener('click', () => {
      showScreen('visitForm');
    });
  }

  // ========== INITIALIZATION ==========
  // Set initial active nav
  if (navItems.home) {
    navItems.home.classList.add('active');
  }

  // Load initial data
  loadInsights();
  loadPlannerEvents();
  updateCalendar(new Date());
  updateNotificationCount();
  loadVisitsData();
  autoGenerateVisitDateTime();
  initVisitStatusButtons();

  // Add welcome message to chat
  if (chatMessages) {
    addMessage('ai', "Hi! I'm your SalesBuddy AI Assistant. How can I help you today?");
  }

  // Show dashboard initially
  showScreen('dashboard');

  console.log('SalesBuddy fully loaded with Auto-Generated Visit Date/Time and End Visit functionality!');
});
