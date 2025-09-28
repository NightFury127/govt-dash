// Government Amendment Dashboard - Seamless UI/UX Implementation

class AmendmentDashboard {
    constructor() {
        this.currentPage = 'home';
        this.amendments = [];
        this.charts = {};
        this.uploadedFiles = [];
        
        // Sample data from requirements
        this.sampleAmendments = [
            {
                id: 1,
                name: "Digital Privacy Protection Act 2025",
                date: "2025-01-15",
                description: "Comprehensive digital privacy legislation requiring explicit consent for data collection and providing citizens with data deletion rights.",
                status: "Active",
                timeline_days: 30,
                total_feedback: 1247,
                sentiment: {"positive": 812, "negative": 249, "neutral": 186}
            },
            {
                id: 2,
                name: "Healthcare Access Reform Bill",
                date: "2025-01-28",
                description: "Reform to improve healthcare access in rural areas and reduce wait times for critical medical procedures.",
                status: "Active",
                timeline_days: 60,
                total_feedback: 892,
                sentiment: {"positive": 642, "negative": 161, "neutral": 89}
            },
            {
                id: 3,
                name: "Climate Action Initiative 2025",
                date: "2025-02-10",
                description: "Comprehensive climate legislation with renewable energy targets and carbon reduction goals.",
                status: "Draft",
                timeline_days: 45,
                total_feedback: 634,
                sentiment: {"positive": 487, "negative": 98, "neutral": 49}
            },
            {
                id: 4,
                name: "Education Technology Enhancement Act",
                date: "2025-02-15",
                description: "Modernize education infrastructure with technology integration and digital learning platforms.",
                status: "Active",
                timeline_days: 35,
                total_feedback: 756,
                sentiment: {"positive": 523, "negative": 145, "neutral": 88}
            }
        ];

        this.sampleAnalytics = {
            "pros": [
                "Strengthens individual privacy rights and data protection",
                "Provides transparency in data collection practices", 
                "Gives citizens control over their personal information",
                "Aligns with international privacy standards",
                "Protects against unauthorized data sharing"
            ],
            "cons": [
                "May increase compliance costs for businesses",
                "Could slow down digital innovation",
                "Implementation complexity for existing systems",
                "Potential impact on targeted services",
                "Enforcement challenges across sectors"
            ],
            "summary": "Citizens generally support this privacy protection amendment, appreciating stronger data rights and consent requirements. However, some express concerns about potential business impact and implementation complexity. Overall sentiment remains positive with citizens viewing this as essential protection for digital rights."
        };
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('Initializing seamless dashboard...');
        
        // Load sample data
        this.amendments = [...this.sampleAmendments];
        
        // Setup all event listeners
        this.setupEventListeners();
        
        // Initialize page content
        this.updateDashboardStats();
        this.renderAmendments();
        this.createOverallCharts();
        
        // Show initial page
        this.showPage('home');
        
        console.log('Dashboard initialized successfully');
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.target.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Amendment buttons
        const addAmendmentBtn = document.getElementById('add-amendment-btn');
        if (addAmendmentBtn) {
            addAmendmentBtn.addEventListener('click', () => this.showAmendmentForm());
        }

        const refreshAmendmentsBtn = document.getElementById('refresh-amendments-btn');
        if (refreshAmendmentsBtn) {
            refreshAmendmentsBtn.addEventListener('click', () => this.refreshAmendments());
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });

        // Amendment form submission
        const amendmentForm = document.getElementById('amendment-form');
        if (amendmentForm) {
            amendmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAmendment();
            });
        }

        // Cancel buttons
        const cancelAmendment = document.getElementById('cancel-amendment');
        if (cancelAmendment) {
            cancelAmendment.addEventListener('click', () => this.hideModal('amendment-modal'));
        }

        // File upload setup
        this.setupFileUpload();

        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        console.log('All event listeners setup complete');
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === page) {
                btn.classList.add('active');
            }
        });

        // Show page
        this.showPage(page);
        this.currentPage = page;

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Page-specific setup
        if (pageId === 'amendments') {
            this.renderAmendments();
        } else if (pageId === 'analytics') {
            setTimeout(() => this.createOverallCharts(), 100);
        }
    }

    updateDashboardStats() {
        const totalAmendments = this.amendments.length;
        const activeAmendments = this.amendments.filter(a => a.status === 'Active').length;
        const totalFeedback = this.amendments.reduce((sum, a) => sum + a.total_feedback, 0);
        const responseRate = '7.8%';

        // Update stat elements
        this.updateElement('total-amendments', totalAmendments);
        this.updateElement('active-amendments', activeAmendments);
        this.updateElement('total-feedback', totalFeedback.toLocaleString());
        this.updateElement('response-rate', responseRate);
    }

    renderAmendments() {
        const container = document.getElementById('amendments-grid');
        if (!container) return;

        if (this.amendments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Amendments Available</h3>
                    <p>Click "Add New Amendment" to create your first amendment.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.amendments.map(amendment => `
            <div class="amendment-card" data-amendment-id="${amendment.id}">
                <div class="amendment-header">
                    <h3 class="amendment-title">${amendment.name}</h3>
                    <span class="amendment-date">${this.formatDate(amendment.date)}</span>
                </div>
                
                <p class="amendment-description">${amendment.description}</p>
                
                <div class="amendment-footer">
                    <span class="amendment-status ${amendment.status.toLowerCase()}">${amendment.status}</span>
                    <div class="amendment-actions">
                        <button class="btn btn--sm btn--secondary edit-amendment" data-id="${amendment.id}">Edit</button>
                        <button class="btn btn--sm btn--primary view-analytics" data-id="${amendment.id}">Analytics</button>
                        <button class="btn btn--sm btn--outline delete-amendment" data-id="${amendment.id}">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to amendment cards
        this.setupAmendmentEventListeners();
    }

    setupAmendmentEventListeners() {
        // Analytics buttons
        document.querySelectorAll('.view-analytics').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const amendmentId = parseInt(e.target.dataset.id);
                this.showAmendmentAnalytics(amendmentId);
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-amendment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const amendmentId = parseInt(e.target.dataset.id);
                this.editAmendment(amendmentId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-amendment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const amendmentId = parseInt(e.target.dataset.id);
                this.deleteAmendment(amendmentId);
            });
        });

        // Click on card for analytics
        document.querySelectorAll('.amendment-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.amendment-actions')) {
                    const amendmentId = parseInt(card.dataset.amendmentId);
                    this.showAmendmentAnalytics(amendmentId);
                }
            });
        });
    }

    showAmendmentForm(amendment = null) {
        const modal = document.getElementById('amendment-modal');
        const title = document.getElementById('amendment-modal-title');
        const form = document.getElementById('amendment-form');
        
        if (amendment) {
            title.textContent = 'Edit Amendment';
            this.populateAmendmentForm(amendment);
            form.dataset.editId = amendment.id;
        } else {
            title.textContent = 'Add New Amendment';
            form.reset();
            delete form.dataset.editId;
        }
        
        this.showModal('amendment-modal');
    }

    populateAmendmentForm(amendment) {
        document.getElementById('amendment-name').value = amendment.name;
        document.getElementById('amendment-description').value = amendment.description;
        document.getElementById('amendment-status').value = amendment.status;
        document.getElementById('amendment-timeline').value = amendment.timeline_days || 30;
    }

    saveAmendment() {
        const form = document.getElementById('amendment-form');
        const formData = new FormData(form);
        
        const amendmentData = {
            name: document.getElementById('amendment-name').value,
            description: document.getElementById('amendment-description').value,
            status: document.getElementById('amendment-status').value,
            timeline_days: parseInt(document.getElementById('amendment-timeline').value),
            date: new Date().toISOString().split('T')[0],
            total_feedback: Math.floor(Math.random() * 500) + 100,
            sentiment: {
                positive: Math.floor(Math.random() * 300) + 200,
                negative: Math.floor(Math.random() * 100) + 50,
                neutral: Math.floor(Math.random() * 150) + 75
            }
        };

        if (form.dataset.editId) {
            // Edit existing amendment
            const amendmentId = parseInt(form.dataset.editId);
            const index = this.amendments.findIndex(a => a.id === amendmentId);
            if (index !== -1) {
                this.amendments[index] = { ...this.amendments[index], ...amendmentData };
                this.showMessage('Amendment updated successfully!', 'success');
            }
        } else {
            // Add new amendment
            amendmentData.id = Math.max(...this.amendments.map(a => a.id), 0) + 1;
            this.amendments.push(amendmentData);
            this.showMessage('Amendment created successfully!', 'success');
        }

        this.hideModal('amendment-modal');
        this.updateDashboardStats();
        this.renderAmendments();
    }

    editAmendment(amendmentId) {
        const amendment = this.amendments.find(a => a.id === amendmentId);
        if (amendment) {
            this.showAmendmentForm(amendment);
        }
    }

    deleteAmendment(amendmentId) {
        if (confirm('Are you sure you want to delete this amendment?')) {
            this.amendments = this.amendments.filter(a => a.id !== amendmentId);
            this.updateDashboardStats();
            this.renderAmendments();
            this.showMessage('Amendment deleted successfully!', 'success');
        }
    }

    refreshAmendments() {
        this.showMessage('Amendments refreshed!', 'success');
        this.renderAmendments();
    }

    showAmendmentAnalytics(amendmentId) {
        const amendment = this.amendments.find(a => a.id === amendmentId);
        if (!amendment) return;

        const modal = document.getElementById('analytics-modal');
        const title = document.getElementById('analytics-title');
        const content = document.getElementById('analytics-modal-content');
        
        title.textContent = `${amendment.name} - Analytics`;
        
        // Simulate API call with sample data
        const analyticsData = this.generateAmendmentAnalytics(amendment);
        this.renderAnalyticsModal(content, amendment, analyticsData);
        
        this.showModal('analytics-modal');
        
        // Create charts after modal is shown
        setTimeout(() => this.createAnalyticsCharts(amendment), 200);
    }

    generateAmendmentAnalytics(amendment) {
        return {
            ...this.sampleAnalytics,
            amendment_id: amendment.id,
            amendment_name: amendment.name,
            total_feedback: amendment.total_feedback,
            sentiment_breakdown: {
                positive: Math.round((amendment.sentiment.positive / amendment.total_feedback) * 100),
                negative: Math.round((amendment.sentiment.negative / amendment.total_feedback) * 100),
                neutral: Math.round((amendment.sentiment.neutral / amendment.total_feedback) * 100)
            },
            response_rate: '7.8%',
            average_sentiment: (amendment.sentiment.positive / (amendment.sentiment.positive + amendment.sentiment.negative)).toFixed(2)
        };
    }

    renderAnalyticsModal(container, amendment, analytics) {
        container.innerHTML = `
            <div class="analytics-details">
                <div class="analytics-summary">
                    <h4>Summary</h4>
                    <p>${analytics.summary}</p>
                </div>
                
                <div class="analytics-metrics">
                    <div class="analytics-metric">
                        <h5>Total Feedback</h5>
                        <div class="value">${analytics.total_feedback.toLocaleString()}</div>
                    </div>
                    <div class="analytics-metric">
                        <h5>Response Rate</h5>
                        <div class="value">${analytics.response_rate}</div>
                    </div>
                    <div class="analytics-metric">
                        <h5>Sentiment Score</h5>
                        <div class="value">${analytics.average_sentiment}</div>
                    </div>
                    <div class="analytics-metric">
                        <h5>Timeline</h5>
                        <div class="value">${amendment.timeline_days} days</div>
                    </div>
                </div>
            </div>

            <div class="pros-cons-section">
                <div class="pros-section">
                    <h5>Pros</h5>
                    <ul class="pros-cons-list">
                        ${analytics.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                </div>
                <div class="cons-section">
                    <h5>Cons</h5>
                    <ul class="pros-cons-list">
                        ${analytics.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="charts-section">
                <div class="chart-card">
                    <h4>Sentiment Distribution</h4>
                    <div class="chart-container" style="position: relative; height: 250px;">
                        <canvas id="amendment-sentiment-chart"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    createAnalyticsCharts(amendment) {
        const canvas = document.getElementById('amendment-sentiment-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.amendmentSentiment) {
            this.charts.amendmentSentiment.destroy();
        }

        const sentimentData = amendment.sentiment;
        
        this.charts.amendmentSentiment = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    data: [sentimentData.positive, sentimentData.negative, sentimentData.neutral],
                    backgroundColor: ['#1FB8CD', '#B4413C', '#5D878F'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createOverallCharts() {
        this.createOverallSentimentChart();
        this.createFeedbackTrendsChart();
    }

    createOverallSentimentChart() {
        const canvas = document.getElementById('overall-sentiment-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.overallSentiment) {
            this.charts.overallSentiment.destroy();
        }

        // Aggregate sentiment data from all amendments
        const totalPositive = this.amendments.reduce((sum, a) => sum + a.sentiment.positive, 0);
        const totalNegative = this.amendments.reduce((sum, a) => sum + a.sentiment.negative, 0);
        const totalNeutral = this.amendments.reduce((sum, a) => sum + a.sentiment.neutral, 0);

        this.charts.overallSentiment = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    data: [totalPositive, totalNegative, totalNeutral],
                    backgroundColor: ['#1FB8CD', '#B4413C', '#5D878F'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createFeedbackTrendsChart() {
        const canvas = document.getElementById('feedback-trends-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.feedbackTrends) {
            this.charts.feedbackTrends.destroy();
        }

        // Generate sample trend data for last 7 days
        const days = [];
        const feedbackCounts = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            feedbackCounts.push(Math.floor(Math.random() * 100) + 50);
        }

        this.charts.feedbackTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Daily Feedback',
                    data: feedbackCounts,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('file-upload-area');
        const fileInput = document.getElementById('file-input');
        const uploadLink = uploadArea?.querySelector('.upload-link');

        if (!uploadArea || !fileInput) return;

        // Click to browse files
        uploadArea.addEventListener('click', () => fileInput.click());
        
        if (uploadLink) {
            uploadLink.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });
        }

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            this.handleFileUpload(files);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFileUpload(files);
        });
    }

    handleFileUpload(files) {
        const progressEl = document.getElementById('upload-progress');
        const progressFill = progressEl?.querySelector('.progress-fill');
        const progressText = progressEl?.querySelector('.progress-text');
        
        if (progressEl) {
            progressEl.classList.remove('hidden');
        }

        files.forEach((file, index) => {
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Add to uploaded files
                    this.uploadedFiles.push({
                        id: Date.now() + index,
                        name: file.name,
                        size: this.formatFileSize(file.size),
                        type: file.type,
                        uploadedAt: new Date()
                    });
                    
                    if (index === files.length - 1) {
                        setTimeout(() => {
                            if (progressEl) progressEl.classList.add('hidden');
                            this.renderUploadedFiles();
                            this.showMessage(`${files.length} file(s) uploaded successfully!`, 'success');
                        }, 500);
                    }
                }
                
                if (progressFill) progressFill.style.width = `${progress}%`;
                if (progressText) progressText.textContent = `Uploading... ${Math.round(progress)}%`;
            }, 200);
        });
    }

    renderUploadedFiles() {
        const container = document.getElementById('uploaded-files');
        if (!container) return;

        if (this.uploadedFiles.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = this.uploadedFiles.map(file => `
            <div class="uploaded-file">
                <div class="file-info">
                    <span class="file-icon">📄</span>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${file.size}</div>
                    </div>
                </div>
                <button class="btn btn--sm btn--outline remove-file" data-file-id="${file.id}">Remove</button>
            </div>
        `).join('');

        // Add remove file functionality
        document.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fileId = parseInt(e.target.dataset.fileId);
                this.removeFile(fileId);
            });
        });
    }

    removeFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
        this.renderUploadedFiles();
        this.showMessage('File removed successfully!', 'success');
    }

    // Modal management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Add smooth scroll to prevent jumping
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Clean up charts if analytics modal
            if (modalId === 'analytics-modal') {
                Object.keys(this.charts).forEach(key => {
                    if (key.includes('amendment') && this.charts[key]) {
                        this.charts[key].destroy();
                        delete this.charts[key];
                    }
                });
            }
        }
    }

    // Message system
    showMessage(text, type = 'success') {
        const container = document.getElementById('message-container');
        if (!container) return;

        const messageId = Date.now();
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <span>${text}</span>
            <button class="message-close" data-message-id="${messageId}">&times;</button>
        `;

        container.appendChild(messageEl);

        // Add close functionality
        messageEl.querySelector('.message-close').addEventListener('click', () => {
            messageEl.remove();
        });

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 4000);
    }

    // Utility functions
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the dashboard when DOM is loaded
let dashboard;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing seamless dashboard...');
    dashboard = new AmendmentDashboard();
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (dashboard) {
        dashboard.showMessage('An error occurred. Please try again.', 'error');
    }
});

// Smooth scroll behavior for all internal links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
            if (dashboard) {
                dashboard.hideModal(modal.id);
            }
        });
    }
});

console.log('Amendment Dashboard script loaded successfully');