// script.js - UPDATED VERSION with all requested changes

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

  // ========== TASK FORM HANDLING - COMPLETELY UPDATED ==========
const taskForm = document.getElementById('salesbuddyTaskForm');
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
      visitAttendee: document.getElementById('sbTaskVisitAttendee').value,
      reminder: document.getElementById('sbTaskReminder').value,
      notificationPerson: Array.from(document.getElementById('sbTaskNotificationPerson').selectedOptions).map(opt => opt.value),
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
      visitAttendee: formData.visitAttendee,
      reminder: formData.reminder,
      comments: formData.comments
    };
    
    alert('Task created successfully!');
    showScreen('tasks');
    
    // Reset form
    this.reset();
  });
}

  // ========== LEAD FORM HANDLING - UPDATED ==========
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

  // ========== OPPORTUNITY FORM - UPDATED ==========
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

  // ========== VISIT FORM ==========
  const visitForm = document.getElementById('salesbuddyVisitForm');
  const cancelVisitBtn = document.getElementById('cancelVisitBtn');

  if (visitForm) {
    visitForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        title: document.getElementById('sbVisitTitle').value,
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
      
      mockData.visits[newVisitId] = {
        id: newVisitId,
        title: formData.title,
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
// Add this to your script.js file, in the DOMContentLoaded event

// Sales target data
// ========== SALES TARGET FUNCTIONALITY ==========
// ========== SALES TARGET FUNCTIONALITY ==========
const salesTargetData = {
  q1: {
    name: "Q1 2024",
    period: "January – March 2024",
    totalTarget: 5000000,
    totalAchieved: 4500000,
    months: [
      { month: "Jan", target: 1666667, achieved: 1800000 },
      { month: "Feb", target: 1666667, achieved: 1500000 },
      { month: "Mar", target: 1666666, achieved: 1200000 }
    ]
  },
  q2: {
    name: "Q2 2024",
    period: "April – June 2024",
    totalTarget: 5500000,
    totalAchieved: 4800000,
    months: [
      { month: "Apr", target: 1833333, achieved: 1600000 },
      { month: "May", target: 1833333, achieved: 1700000 },
      { month: "Jun", target: 1833334, achieved: 1500000 }
    ]
  },
  q3: {
    name: "Q3 2024",
    period: "July – September 2024",
    totalTarget: 6000000,
    totalAchieved: 5200000,
    months: [
      { month: "Jul", target: 2000000, achieved: 1800000 },
      { month: "Aug", target: 2000000, achieved: 1700000 },
      { month: "Sep", target: 2000000, achieved: 1700000 }
    ]
  },
  q4: {
    name: "Q4 2024",
    period: "October – December 2024",
    totalTarget: 6500000,
    totalAchieved: 5800000,
    months: [
      { month: "Oct", target: 2166667, achieved: 2000000 },
      { month: "Nov", target: 2166667, achieved: 1900000 },
      { month: "Dec", target: 2166666, achieved: 1900000 }
    ]
  },
  monthly: {
    name: "Monthly View",
    period: "Current Month",
    totalTarget: 1666667,
    totalAchieved: 1800000,
    months: [
      { month: "Current", target: 1666667, achieved: 1800000 }
    ]
  }
};

let currentRange = 'q1';

// Initialize sales target
function initSalesTarget() {
  console.log('Initializing sales target...');
  
  // Time range selector
  const timeRangeSelect = document.getElementById('timeRangeSelect');
  if (timeRangeSelect) {
    timeRangeSelect.addEventListener('change', function() {
      currentRange = this.value;
      console.log('Range changed to:', currentRange);
      updateSalesTargetDisplay();
    });
  } else {
    console.error('timeRangeSelect element not found!');
  }

  // Initial update
  updateSalesTargetDisplay();
}

// Update sales target display
function updateSalesTargetDisplay() {
  console.log('Updating sales target display for range:', currentRange);
  
  const data = salesTargetData[currentRange] || salesTargetData.q1;
  console.log('Data loaded:', data);
  
  // Update header
  const salesTargetPeriod = document.getElementById('salesTargetPeriod');
  const currentPeriodText = document.getElementById('currentPeriodText');
  const salesCurrentAmount = document.getElementById('salesCurrentAmount');
  const salesTargetAmount = document.getElementById('salesTargetAmount');
  const salesProgressBar = document.getElementById('salesProgressBar');
  const salesProgressText = document.getElementById('salesProgressText');
  const achievedAmount = document.getElementById('achievedAmount');
  const remainingAmount = document.getElementById('remainingAmount');
  
  // Calculate values
  const totalAchieved = data.totalAchieved;
  const totalTarget = data.totalTarget;
  const percentage = Math.round((totalAchieved / totalTarget) * 100);
  const remaining = Math.max(0, totalTarget - totalAchieved);
  
  // Update UI
  if (salesTargetPeriod) {
    salesTargetPeriod.textContent = data.name;
    console.log('Updated salesTargetPeriod:', data.name);
  }
  
  if (currentPeriodText) {
    currentPeriodText.textContent = data.period;
    console.log('Updated currentPeriodText:', data.period);
  }
  
  if (salesCurrentAmount) {
    salesCurrentAmount.textContent = formatCurrencyWithCommas(totalAchieved);
    console.log('Updated salesCurrentAmount:', formatCurrencyWithCommas(totalAchieved));
  }
  
  if (salesTargetAmount) {
    salesTargetAmount.textContent = formatCurrencyWithCommas(totalTarget);
    console.log('Updated salesTargetAmount:', formatCurrencyWithCommas(totalTarget));
  }
  
  if (achievedAmount) {
    achievedAmount.textContent = formatCurrencyShort(totalAchieved);
    console.log('Updated achievedAmount:', formatCurrencyShort(totalAchieved));
  }
  
  if (remainingAmount) {
    remainingAmount.textContent = formatCurrencyShort(remaining);
    console.log('Updated remainingAmount:', formatCurrencyShort(remaining));
  }
  
  // Update progress bar
  if (salesProgressBar) {
    salesProgressBar.style.width = `${Math.min(percentage, 100)}%`;
    salesProgressBar.className = getProgressColorClass(percentage);
    console.log('Updated progress bar width:', `${Math.min(percentage, 100)}%`);
  }
  
  // Update progress text
  if (salesProgressText) {
    salesProgressText.textContent = getProgressStatusText(percentage);
    salesProgressText.className = `progress-text ${getProgressColorClass(percentage)}`;
    console.log('Updated progress text:', getProgressStatusText(percentage));
  }
  
  // Update monthly breakdown
  console.log('Calling updateMonthlyBreakdown with months:', data.months);
  updateMonthlyBreakdown(data.months);
}

// Update monthly breakdown with color coding
function updateMonthlyBreakdown(months) {
  console.log('updateMonthlyBreakdown called with:', months);
  
  const monthlyBreakdown = document.getElementById('monthlyBreakdown');
  if (!monthlyBreakdown) {
    console.error('monthlyBreakdown element not found!');
    return;
  }
  
  if (!months || months.length === 0) {
    monthlyBreakdown.innerHTML = '<div class="no-data">No monthly data available</div>';
    console.log('No months data, showing no-data message');
    return;
  }
  
  let html = '';
  
  months.forEach((monthData, index) => {
    const percentage = Math.round((monthData.achieved / monthData.target) * 100);
    const statusClass = getMonthlyStatusClass(percentage);
    const statusIcon = getMonthlyStatusIcon(percentage);
    
    console.log(`Month ${index + 1}:`, monthData.month, 'Percentage:', percentage, 'Class:', statusClass);
    
    html += `
      <div class="monthly-item ${statusClass}">
        <div class="monthly-item-header">
          <div class="monthly-info">
            <span class="monthly-name">${monthData.month}</span>
            <span class="monthly-target">Target: ${formatCurrencyShort(monthData.target)}</span>
          </div>
          <div class="monthly-achievement">
            <span class="monthly-percentage ${statusClass}">${percentage}% ${statusIcon}</span>
            <span class="monthly-amount">${formatCurrencyShort(monthData.achieved)}</span>
          </div>
        </div>
        <div class="progress-bar">
          <span class="progress-fill ${statusClass}" style="width:${Math.min(percentage, 100)}%"></span>
        </div>
        <div class="monthly-details">
          <div class="monthly-status ${statusClass}">
            ${getMonthlyStatusText(percentage)}
          </div>
        </div>
      </div>
    `;
  });
  
  monthlyBreakdown.innerHTML = html;
  console.log('Monthly breakdown HTML updated successfully');
  console.log('Generated HTML:', html);
}

// Helper functions
function formatCurrencyShort(amount) {
  if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(1) + 'L';
  } else if (amount >= 1000) {
    return '₹' + (amount / 1000).toFixed(1) + 'K';
  } else {
    return '₹' + amount;
  }
}

function formatCurrencyWithCommas(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function getProgressColorClass(percentage) {
  if (percentage >= 100) return 'excellent';
  if (percentage >= 80) return 'good';
  if (percentage >= 60) return 'warning';
  return 'poor';
}

function getMonthlyStatusClass(percentage) {
  if (percentage >= 100) return 'achieved';
  if (percentage >= 80) return 'near';
  return 'below';
}

function getMonthlyStatusIcon(percentage) {
  if (percentage >= 100) return '✅';
  if (percentage >= 80) return '✓';
  return '⚠';
}

function getProgressStatusText(percentage) {
  if (percentage >= 100) return '🎯 Target Achieved! Excellent work!';
  if (percentage >= 90) return '✅ Almost there! You\'re on track';
  if (percentage >= 80) return '✓ Good progress, keep going';
  if (percentage >= 70) return '⚠ Needs attention - focus required';
  return '🚨 Behind schedule - immediate action needed';
}

function getMonthlyStatusText(percentage) {
  if (percentage >= 100) return 'Target achieved!';
  if (percentage >= 90) return 'Almost there';
  if (percentage >= 80) return 'Good progress';
  if (percentage >= 70) return 'Needs attention';
  if (percentage >= 60) return 'Below target';
  return 'Critical - needs action';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing sales target...');
  initSalesTarget();
  
  // Test: Force display after 2 seconds
  setTimeout(() => {
    console.log('Testing sales target display...');
    const testElement = document.getElementById('monthlyBreakdown');
    if (testElement) {
      console.log('monthlyBreakdown element found:', testElement);
      console.log('Current innerHTML:', testElement.innerHTML);
    } else {
      console.error('monthlyBreakdown element STILL not found!');
    }
  }, 2000);
});
// Initialize sales target
function initSalesTarget() {
  // Time range selector
  const timeRangeSelect = document.getElementById('timeRangeSelect');
  if (timeRangeSelect) {
    timeRangeSelect.addEventListener('change', function() {
      currentRange = this.value;
      updateSalesTargetDisplay();
    });
  }

  // Initial update
  updateSalesTargetDisplay();
}

// Update sales target display
function updateSalesTargetDisplay() {
  const data = salesTargetData[currentRange] || salesTargetData.q1;
  
  // Update header
  const salesTargetPeriod = document.getElementById('salesTargetPeriod');
  const currentPeriodText = document.getElementById('currentPeriodText');
  const salesCurrentAmount = document.getElementById('salesCurrentAmount');
  const salesTargetAmount = document.getElementById('salesTargetAmount');
  const salesProgressBar = document.getElementById('salesProgressBar');
  const salesProgressText = document.getElementById('salesProgressText');
  const achievedAmount = document.getElementById('achievedAmount');
  const remainingAmount = document.getElementById('remainingAmount');
  
  // Calculate values
  const totalAchieved = data.totalAchieved;
  const totalTarget = data.totalTarget;
  const percentage = Math.round((totalAchieved / totalTarget) * 100);
  const remaining = Math.max(0, totalTarget - totalAchieved);
  
  // Update UI
  if (salesTargetPeriod) salesTargetPeriod.textContent = data.name;
  if (currentPeriodText) currentPeriodText.textContent = data.period;
  if (salesCurrentAmount) salesCurrentAmount.textContent = formatCurrencyWithCommas(totalAchieved);
  if (salesTargetAmount) salesTargetAmount.textContent = formatCurrencyWithCommas(totalTarget);
  if (achievedAmount) achievedAmount.textContent = formatCurrencyShort(totalAchieved);
  if (remainingAmount) remainingAmount.textContent = formatCurrencyShort(remaining);
  
  // Update progress bar
  if (salesProgressBar) {
    salesProgressBar.style.width = `${Math.min(percentage, 100)}%`;
    salesProgressBar.className = getProgressColorClass(percentage);
  }
  
  // Update progress text
  if (salesProgressText) {
    salesProgressText.textContent = getProgressStatusText(percentage);
    salesProgressText.className = `progress-text ${getProgressColorClass(percentage)}`;
  }
  
  // Update monthly breakdown
  updateMonthlyBreakdown(data.months);
}

// Update monthly breakdown with color coding
// Update monthly breakdown with color coding - FIXED VERSION
function updateMonthlyBreakdown(months) {
  const monthlyBreakdown = document.getElementById('monthlyBreakdown');
  if (!monthlyBreakdown) return;
  
  let html = '';
  
  months.forEach((monthData, index) => {
    const percentage = Math.round((monthData.achieved / monthData.target) * 100);
    const statusClass = getMonthlyStatusClass(percentage);
    const statusIcon = getMonthlyStatusIcon(percentage);
    
    html += `
      <div class="monthly-item ${statusClass}">
        <div class="monthly-item-header">
          <div class="monthly-info">
            <span class="monthly-name">${monthData.month}</span>
            <span class="monthly-target">Target: ${formatCurrencyShort(monthData.target)}</span>
          </div>
          <div class="monthly-achievement">
            <span class="monthly-percentage ${statusClass}">${percentage}% ${statusIcon}</span>
            <span class="monthly-amount">${formatCurrencyShort(monthData.achieved)}</span>
          </div>
        </div>
        <div class="progress-bar">
          <span class="progress-fill ${statusClass}" style="width:${Math.min(percentage, 100)}%"></span>
        </div>
        <div class="monthly-details">
          <div class="monthly-status ${statusClass}">
            ${getMonthlyStatusText(percentage)}
          </div>
        </div>
      </div>
    `;
  });
  
  monthlyBreakdown.innerHTML = html;
}

// Helper functions
function formatCurrencyShort(amount) {
  if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(1) + 'L';
  } else if (amount >= 1000) {
    return '₹' + (amount / 1000).toFixed(1) + 'K';
  } else {
    return '₹' + amount;
  }
}

function formatCurrencyWithCommas(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function getProgressColorClass(percentage) {
  if (percentage >= 100) return 'excellent';
  if (percentage >= 80) return 'good';
  if (percentage >= 60) return 'warning';
  return 'poor';
}

function getMonthlyStatusClass(percentage) {
  if (percentage >= 100) return 'achieved';
  if (percentage >= 80) return 'near';
  return 'below';
}

function getMonthlyStatusIcon(percentage) {
  if (percentage >= 100) return '✅';
  if (percentage >= 80) return '✓';
  return '⚠';
}

function getProgressStatusText(percentage) {
  if (percentage >= 100) return '🎯 Target Achieved! Excellent work!';
  if (percentage >= 90) return '✅ Almost there! You\'re on track';
  if (percentage >= 80) return '✓ Good progress, keep going';
  if (percentage >= 70) return '⚠ Needs attention - focus required';
  return '🚨 Behind schedule - immediate action needed';
}

function getMonthlyStatusText(percentage) {
  if (percentage >= 100) return 'Target achieved!';
  if (percentage >= 90) return 'Almost there';
  if (percentage >= 80) return 'Good progress';
  if (percentage >= 70) return 'Needs attention';
  if (percentage >= 60) return 'Below target';
  return 'Critical - needs action';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSalesTarget);
// Format currency
function formatCurrency(amount) {
  if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(1) + 'L';
  } else if (amount >= 1000) {
    return '₹' + (amount / 1000).toFixed(1) + 'K';
  } else {
    return '₹' + amount;
  }
}

// Format large currency with commas
function formatCurrencyWithCommas(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// Calculate percentage
function calculatePercentage(achieved, target) {
  return target > 0 ? Math.round((achieved / target) * 100) : 0;
}

// Get color class based on percentage
function getAchievementColor(percentage) {
  if (percentage >= 100) return 'excellent';
  if (percentage >= 80) return 'good';
  if (percentage >= 60) return 'warning';
  return 'poor';
}

// Get status text based on percentage
function getStatusText(percentage) {
  if (percentage >= 100) return '✓ Target Achieved!';
  if (percentage >= 90) return '✓ Almost there!';
  if (percentage >= 80) return '✓ On track';
  if (percentage >= 70) return '⚠ Needs attention';
  return '⚠ Behind schedule';
}

// Update sales target display
function updateSalesTarget(rangeId) {
  const data = salesTargetData[rangeId];
  if (!data) return;
  
  currentRange = rangeId;
  
  // Update overall progress
  const percentage = calculatePercentage(data.achieved, data.totalTarget);
  const overallProgress = document.getElementById('overallProgress');
  const progressStatus = document.getElementById('progressStatus');
  const currentAmount = document.getElementById('currentAmount');
  const achievedAmount = document.getElementById('achievedAmount');
  const remainingAmount = document.getElementById('remainingAmount');
  const totalTarget = document.getElementById('totalTarget');
  const currentRangeText = document.getElementById('currentRangeText');
  const onTrackStatus = document.getElementById('onTrackStatus');
  
  if (overallProgress) {
    overallProgress.style.width = `${percentage}%`;
    overallProgress.className = `progress-fill ${getAchievementColor(percentage)}`;
  }
  
  if (progressStatus) {
    progressStatus.textContent = getStatusText(percentage);
    progressStatus.className = `progress-text ${getAchievementColor(percentage)}`;
  }
  
  if (currentAmount) {
    currentAmount.textContent = formatCurrencyWithCommas(data.achieved);
  }
  
  if (achievedAmount) {
    achievedAmount.textContent = formatCurrency(data.achieved);
  }
  
  if (remainingAmount) {
    const remaining = data.totalTarget - data.achieved;
    remainingAmount.textContent = formatCurrency(Math.max(0, remaining));
  }
  
  if (totalTarget) {
    totalTarget.textContent = formatCurrency(data.totalTarget);
  }
  
  if (currentRangeText) {
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];
    const startMonthName = monthNames[parseInt(data.startMonth) - 1];
    const endMonthName = monthNames[parseInt(data.endMonth) - 1];
    currentRangeText.textContent = `${startMonthName} – ${endMonthName} ${data.year}`;
  }
  
  if (onTrackStatus) {
    onTrackStatus.textContent = percentage >= 80 ? 'Yes ✓' : 'No ⚠';
    onTrackStatus.className = percentage >= 80 ? 'stat-value excellent' : 'stat-value warning';
  }
  
  // Update days left (simulated)
  const daysLeft = document.getElementById('daysLeft');
  if (daysLeft) {
    const days = Math.floor(Math.random() * 30) + 15; // Random 15-45 days
    daysLeft.textContent = days;
  }
  
  // Update monthly breakdown
  updateMonthlyBreakdown(data);
}

// Update monthly breakdown
function updateMonthlyBreakdown(data) {
  const monthlyBreakdown = document.getElementById('monthlyBreakdown');
  if (!monthlyBreakdown) return;
  
  monthlyBreakdown.innerHTML = '';
  
  data.months.forEach(month => {
    const percentage = calculatePercentage(month.achieved, month.target);
    
    const monthElement = document.createElement('div');
    monthElement.className = 'month';
    
    monthElement.innerHTML = `
      <div class="month-row">
        <span>${month.name}</span>
        <span class="month-amount">${formatCurrency(month.achieved)} / ${formatCurrency(month.target)}</span>
      </div>
      <div class="progress-bar">
        <span class="progress-fill ${month.color}" style="width:${percentage}%"></span>
      </div>
      <div class="month-details">
        <span class="achievement-status ${month.color}">${percentage}% ${percentage >= 100 ? '✓' : percentage >= 80 ? '✓' : '⚠'}</span>
        <span class="month-target">Target: ${formatCurrency(month.target)}</span>
      </div>
    `;
    
    monthlyBreakdown.appendChild(monthElement);
  });
  
  // Update summary statistics
  updateSummaryStats(data);
}

// Update summary statistics
function updateSummaryStats(data) {
  const percentages = data.months.map(month => 
    calculatePercentage(month.achieved, month.target)
  );
  
  const bestMonthIndex = percentages.indexOf(Math.max(...percentages));
  const bestMonth = data.months[bestMonthIndex];
  const avgAchievement = Math.round(percentages.reduce((a, b) => a + b) / percentages.length);
  
  const statItems = document.querySelectorAll('.summary-stats .stat-item');
  if (statItems.length >= 2) {
    // Best Month
    const bestMonthEl = statItems[0].querySelector('.stat-value');
    if (bestMonthEl) {
      bestMonthEl.textContent = `${bestMonth.name} (${calculatePercentage(bestMonth.achieved, bestMonth.target)}%)`;
      bestMonthEl.className = `stat-value ${bestMonth.color}`;
    }
    
    // Average Achievement
    const avgEl = statItems[1].querySelector('.stat-value');
    if (avgEl) {
      avgEl.textContent = `${avgAchievement}%`;
      avgEl.className = `stat-value ${getAchievementColor(avgAchievement)}`;
    }
  }
}

// Initialize sales target functionality
function initSalesTarget() {
  // Range button click handlers
  document.querySelectorAll('.range-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active button
      document.querySelectorAll('.range-btn').forEach(b => {
        b.classList.remove('active');
      });
      this.classList.add('active');
      
      const range = this.dataset.range;
      
      if (range === 'custom') {
        // Show custom range selector
        const customRange = document.getElementById('customRange');
        if (customRange) customRange.classList.remove('hidden');
      } else {
        // Hide custom range selector
        const customRange = document.getElementById('customRange');
        if (customRange) customRange.classList.add('hidden');
        
        // Update display
        updateSalesTarget(range);
      }
    });
  });
  
  // Apply custom range
  const applyRangeBtn = document.getElementById('applyRangeBtn');
  if (applyRangeBtn) {
    applyRangeBtn.addEventListener('click', () => {
      const startMonth = document.getElementById('startMonth')?.value || '01';
      const endMonth = document.getElementById('endMonth')?.value || '03';
      const year = document.getElementById('year')?.value || '2024';
      
      // Create custom range data
      const customData = {
        name: "Custom Range",
        startMonth,
        endMonth,
        year,
        totalTarget: 4000000,
        achieved: 3200000,
        months: [
          {
            name: getMonthName(startMonth),
            target: 2000000,
            achieved: 1800000,
            color: "good"
          },
          {
            name: getMonthName(endMonth),
            target: 2000000,
            achieved: 1400000,
            color: "warning"
          }
        ]
      };
      
      // Update display with custom data
      updateDisplayWithCustomData(customData);
    });
  }
  
  // Initial update
  updateSalesTarget('q1');
}

// Helper function to get month name
function getMonthName(monthNumber) {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
  return monthNames[parseInt(monthNumber) - 1] || "Unknown";
}

// Update display with custom data
function updateDisplayWithCustomData(data) {
  // Update overall progress
  const percentage = calculatePercentage(data.achieved, data.totalTarget);
  const overallProgress = document.getElementById('overallProgress');
  const progressStatus = document.getElementById('progressStatus');
  const currentAmount = document.getElementById('currentAmount');
  const achievedAmount = document.getElementById('achievedAmount');
  const remainingAmount = document.getElementById('remainingAmount');
  const totalTarget = document.getElementById('totalTarget');
  const currentRangeText = document.getElementById('currentRangeText');
  
  if (overallProgress) {
    overallProgress.style.width = `${percentage}%`;
    overallProgress.className = `progress-fill ${getAchievementColor(percentage)}`;
  }
  
  if (progressStatus) {
    progressStatus.textContent = getStatusText(percentage);
    progressStatus.className = `progress-text ${getAchievementColor(percentage)}`;
  }
  
  if (currentAmount) {
    currentAmount.textContent = formatCurrencyWithCommas(data.achieved);
  }
  
  if (achievedAmount) {
    achievedAmount.textContent = formatCurrency(data.achieved);
  }
  
  if (remainingAmount) {
    const remaining = data.totalTarget - data.achieved;
    remainingAmount.textContent = formatCurrency(Math.max(0, remaining));
  }
  
  if (totalTarget) {
    totalTarget.textContent = formatCurrency(data.totalTarget);
  }
  
  if (currentRangeText) {
    const startMonthName = getMonthName(data.startMonth);
    const endMonthName = getMonthName(data.endMonth);
    currentRangeText.textContent = `${startMonthName} – ${endMonthName} ${data.year}`;
  }
  
  // Update monthly breakdown
  const monthlyBreakdown = document.getElementById('monthlyBreakdown');
  if (monthlyBreakdown) {
    monthlyBreakdown.innerHTML = '';
    
    data.months.forEach(month => {
      const percentage = calculatePercentage(month.achieved, month.target);
      
      const monthElement = document.createElement('div');
      monthElement.className = 'month';
      
      monthElement.innerHTML = `
        <div class="month-row">
          <span>${month.name}</span>
          <span class="month-amount">${formatCurrency(month.achieved)} / ${formatCurrency(month.target)}</span>
        </div>
        <div class="progress-bar">
          <span class="progress-fill ${month.color}" style="width:${percentage}%"></span>
        </div>
        <div class="month-details">
          <span class="achievement-status ${month.color}">${percentage}% ${percentage >= 100 ? '✓' : percentage >= 80 ? '✓' : '⚠'}</span>
          <span class="month-target">Target: ${formatCurrency(month.target)}</span>
        </div>
      `;
      
      monthlyBreakdown.appendChild(monthElement);
    });
  }
}

// Initialize sales target when DOM is loaded
document.addEventListener('DOMContentLoaded', initSalesTarget);
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

  // ========== DETAIL PAGE LOADERS - UPDATED ==========
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

  // Add welcome message to chat
  if (chatMessages) {
    addMessage('ai', "Hi! I'm your SalesBuddy AI Assistant. How can I help you today?");
  }

  // Show dashboard initially
  showScreen('dashboard');

  console.log('SalesBuddy fully loaded with all requested updates!');
});