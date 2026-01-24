# Email Integration Setup

Your contact form is now set up to use [EmailJS](https://www.emailjs.com/). This allows you to receive emails directly from your website without needing a backend server.

## Setup Instructions

1.  **Create an EmailJS Account**
    *   Go to [https://www.emailjs.com/](https://www.emailjs.com/) and sign up for a free account.

2.  **Add an Email Service**
    *   In the EmailJS dashboard, go to the **Email Services** tab.
    *   Click **Add New Service**.
    *   Select your email provider (e.g., Gmail, Outlook, Yahoo).
    *   Connect your account and click **Create Service**.
    *   Copy the **Service ID** (e.g., `service_xyz123`).

3.  **Create an Email Template**
    *   Go to the **Email Templates** tab.
    *   Click **Create New Template**.
    *   Design your email template. You can use the following variables which match your form fields:
        *   `{{from_name}}` - The sender's name
        *   `{{from_email}}` - The sender's email address
        *   `{{phone}}` - The sender's phone number
        *   `{{project_type}}` - The selected project type
        *   `{{message}}` - The message content
    *   Example Subject: `New Contact Form Submission from {{from_name}}`
    *   Example Content:
        ```
        Name: {{from_name}}
        Email: {{from_email}}
        Phone: {{phone}}
        Project Type: {{project_type}}
        
        Message:
        {{message}}
        ```
    *   Save the template and copy the **Template ID** (e.g., `template_abc456`).

4.  **Get Your Public Key**
    *   Go to the **Account** page (click your avatar in the top right).
    *   Copy your **Public Key** (e.g., `user_123456789`).

5.  **Update the Configuration File**
    *   Open `src/config/email.ts` in your project.
    *   Replace the placeholder values with your actual keys:
        ```typescript
        export const emailConfig = {
          serviceId: "YOUR_SERVICE_ID", // Paste your Service ID here
          templateId: "YOUR_TEMPLATE_ID", // Paste your Template ID here
          publicKey: "YOUR_PUBLIC_KEY", // Paste your Public Key here
        };
        ```

## Testing

Once you've updated the configuration file, try sending a message through the contact form. You should receive an email shortly after submission.

If the keys are not configured (left as default), the form will simulate a successful submission for testing purposes.
