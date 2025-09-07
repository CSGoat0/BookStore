import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      initial: 'SJ',
      bio: 'With over 10 years of experience in e-commerce, Sarah founded our company with a vision to revolutionize online shopping.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Product',
      initial: 'MC',
      bio: 'Michael ensures our product selection meets the highest standards of quality and customer satisfaction.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Customer Experience Manager',
      initial: 'ER',
      bio: 'Emma leads our customer support team to deliver exceptional service and build lasting relationships.'
    },
    {
      name: 'James Wilson',
      role: 'Tech Lead',
      initial: 'JW',
      bio: 'James oversees our technology stack and ensures a seamless shopping experience for our customers.'
    }
  ];

  stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '500+', label: 'Products Available' },
    { number: '24/7', label: 'Customer Support' },
    { number: '100%', label: 'Satisfaction Guarantee' }
  ];

  values = [
    {
      icon: 'bi-shield-check',
      title: 'Quality Assurance',
      description: 'Every product undergoes rigorous quality checks to ensure excellence.'
    },
    {
      icon: 'bi-truck',
      title: 'Fast Delivery',
      description: 'We pride ourselves on quick and reliable shipping across the globe.'
    },
    {
      icon: 'bi-arrow-repeat',
      title: 'Easy Returns',
      description: '30-day hassle-free return policy for all our customers.'
    },
    {
      icon: 'bi-heart',
      title: 'Customer First',
      description: 'Your satisfaction is our top priority in everything we do.'
    }
  ];
}
