
export interface ChatbotIntent {
  id: string;
  keywords: string[];
  response: string;
}

const INTENTS: ChatbotIntent[] = [
  {
    id: 'auth_help',
    keywords: ['login', 'password', 'token', 'access', 'denied', 'signin', 'logout'],
    response: "• Login: Ensure your email and password are correct.\n• Demo Mode: If the backend is unreachable, you can log in with credentials created during your current session.\n• Session: Tokens are valid for 7 days. If you see 'Unauthorized', please log in again."
  },
  {
    id: 'client_help',
    keywords: ['add client', 'edit client', 'delete client', 'visible', 'mobile', 'new client'],
    response: "• Adding Clients: Go to the 'Clients' tab and click '+ Add Client'.\n• Managing: You can edit details or remove clients using the action buttons in the client table.\n• Visibility: You can only see clients assigned to your broker ID."
  },
  {
    id: 'policy_help',
    keywords: ['add policy', 'edit policy', 'delete policy', 'expiry', 'premium', 'company', 'multiple'],
    response: "• New Policy: In the 'Policies' tab, select a client and fill in the policy details.\n• Multiple Policies: A single client can have multiple policies (e.g., Auto and Home).\n• Expiry: Enter the exact date to ensure reminders trigger correctly."
  },
  {
    id: 'reminder_help',
    keywords: ['reminder', 'when', 'sent', 'milestone', '30', '20', '10', '5', '1', 'duplicate', 'daily'],
    response: "• Schedule: Reminders are sent daily at 9:00 AM IST.\n• Milestones: Automated alerts trigger at 30, 20, 10, 5, 1, and 0 days before expiry.\n• Duplicates: The system logs every sent reminder to prevent duplicate messages to the same client."
  },
  {
    id: 'whatsapp_help',
    keywords: ['whatsapp', 'delivered', 'twilio', 'sandbox', 'phone', 'message', 'not sent'],
    response: "• Number Format: Ensure phone numbers include the country code (e.g., +91...).\n• Twilio Sandbox: If using a trial account, the recipient must join your sandbox first.\n• Failure: Check the backend logs or 'ReminderLog' to see the delivery status."
  },
  {
    id: 'dashboard_help',
    keywords: ['dashboard', 'metrics', 'charts', 'today', 'upcoming', 'stats', 'graph'],
    response: "• Metrics: View total clients, policies, and categorized expiries at a glance.\n• Upcoming: The sidebar shows policies expiring soonest.\n• Refresh: Click on the dashboard tab to reload the latest statistics."
  },
  {
    id: 'system_help',
    keywords: ['cron', 'server', 'timezone', 'ist', 'restart', 'data', 'offline'],
    response: "• Timezone: All triggers are based on Indian Standard Time (IST).\n• Cron Job: The background task resumes automatically if the server restarts.\n• Offline: The app uses 'Demo Mode' with local storage if the backend server is down."
  }
];

const FALLBACK_RESPONSE = "I can help with login, clients, policies, reminders, WhatsApp, or dashboard issues. Please choose one of these topics.";

export const getChatbotResponse = (input: string): string => {
  const normalizedInput = input.toLowerCase().trim();
  
  if (!normalizedInput) return FALLBACK_RESPONSE;

  // Find the first intent where at least one keyword matches the input
  const match = INTENTS.find(intent => 
    intent.keywords.some(keyword => normalizedInput.includes(keyword))
  );

  return match ? match.response : FALLBACK_RESPONSE;
};
