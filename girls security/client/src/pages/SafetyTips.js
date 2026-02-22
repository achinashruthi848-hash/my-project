import React from 'react';
import './SafetyTips.css';

const TIPS = [
  {
    title: 'When walking alone',
    icon: '🚶',
    points: [
      'Stay in well-lit, populated areas.',
      'Keep your phone charged and accessible.',
      'Share your live location with a trusted contact.',
      'Avoid wearing headphones so you can stay aware of surroundings.',
    ],
  },
  {
    title: 'Using public transport',
    icon: '🚌',
    points: [
      'Try to board buses/trains with other people when possible.',
      'Sit near the driver or in a visible area.',
      'If you feel unsafe, get off at the next stop and call someone.',
    ],
  },
  {
    title: 'At home',
    icon: '🏠',
    points: [
      'Keep doors and windows locked.',
      'Don’t open the door to strangers; use a peephole or camera.',
      'Have emergency numbers saved and easily accessible.',
    ],
  },
  {
    title: 'Online safety',
    icon: '📱',
    points: [
      'Don’t share your location or personal details with strangers.',
      'Meet online contacts only in public places and tell someone where you’re going.',
      'Block and report suspicious or harassing accounts.',
    ],
  },
  {
    title: 'In an emergency',
    icon: '🚨',
    points: [
      'Use the SheShield Emergency Alert button to notify your contacts.',
      'Call local emergency services (e.g., 911) if you can.',
      'Try to note landmarks or address for your location.',
    ],
  },
];

export default function SafetyTips() {
  return (
    <div className="page safety-tips-page">
      <div className="container">
        <h1 className="page-title">Safety Tips</h1>
        <p className="page-sub">Practical advice to help you stay safe in different situations.</p>

        <div className="tips-grid">
          {TIPS.map((tip, i) => (
            <div key={i} className="card tip-card">
              <span className="tip-icon">{tip.icon}</span>
              <h2>{tip.title}</h2>
              <ul>
                {tip.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
