import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('email')
export class NotificationProcessor {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  @Process('schedule-created')
  async handleScheduleCreated(job: Job) {
    const { customerEmail, customerName, doctorName, scheduleDate } = job.data;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: customerEmail,
      subject: 'Schedule Created',
      text: `Hello ${customerName}, your schedule with Dr. ${doctorName} on ${scheduleDate} has been created.`,
    });

    console.log(`Schedule created email sent to ${customerEmail}`);
  }

  @Process('schedule-deleted')
  async handleScheduleDeleted(job: Job) {
    const { customerEmail, customerName, doctorName, scheduleDate } = job.data;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: customerEmail,
      subject: 'Schedule Deleted',
      text: `Hello ${customerName}, your schedule with Dr. ${doctorName} on ${scheduleDate} has been deleted.`,
    });

    console.log(`Schedule deleted email sent to ${customerEmail}`);
  }
}