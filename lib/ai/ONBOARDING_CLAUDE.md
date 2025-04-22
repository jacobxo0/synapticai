# Claude Onboarding Copy

## Welcome Message (Production)

```typescript
{
  welcome: {
    headline: "Welcome to Mind Mate",
    subtext: "I'm here to support you in exploring your thoughts and feelings. Think of me as a gentle companion who listens and helps you reflect.",
    toneNote: "I can adapt to your preferred way of talking - whether you like warm support, curious exploration, or direct guidance."
  },
  
  memory: {
    explanation: "To better support you, I can remember our conversations and what matters to you. You're always in control of what I remember.",
    control: "You can change these settings anytime in your preferences. I'll always respect your choices.",
    privacy: "Your conversations stay private and secure. I only remember what you're comfortable sharing."
  },
  
  closing: {
    main: "This is your space to explore and grow. We'll move at your pace, and I'm here to support you however feels right.",
    action: "Would you like to start with a gentle conversation, or would you prefer to explore the settings first?"
  }
}
```

## Welcome Message (Development)

```typescript
{
  welcome: {
    headline: "Welcome to Mind Mate (Development Mode)",
    subtext: "I'm here to help you explore and test the features of Mind Mate. I can adapt to different conversation styles and remember our discussions.",
    toneNote: "You can try different conversation styles - supportive, curious, or direct - to see what feels right for you."
  },
  
  memory: {
    explanation: "In development mode, I can remember our conversations to help test the experience. You can adjust these settings to see how they work.",
    control: "Feel free to explore the memory settings and see how they affect our conversation.",
    privacy: "Note: This is a development environment. Your conversations here are for testing purposes."
  },
  
  closing: {
    main: "Let's explore Mind Mate together. You can try different features and settings to see how they work.",
    action: "Would you like to start testing the conversation features, or would you prefer to explore the settings first?"
  }
}
```

## Settings Explanation Modal

```typescript
{
  title: "How I Can Support You",
  
  sections: {
    conversation: {
      title: "Our Conversations",
      description: "I can remember our discussions to better understand your journey. This helps me provide more meaningful support.",
      control: "You choose what I remember, and you can change this anytime."
    },
    
    tone: {
      title: "Conversation Style",
      description: "I can adapt to your preferred way of talking. Whether you like warm support, curious exploration, or direct guidance.",
      control: "You can change this anytime to find what works best for you."
    },
    
    privacy: {
      title: "Your Privacy",
      description: "Your conversations stay private and secure. I only remember what you're comfortable sharing.",
      control: "You're always in control of your information."
    }
  },
  
  closing: {
    text: "These settings help me support you better. You can adjust them anytime to find what feels right for you.",
    action: "Let me know if you'd like to explore any of these settings further."
  }
}
```

## Implementation Guidelines

### 1. Emotional Safety
- Keep language gentle and non-technical
- Focus on user control and comfort
- Avoid triggering technical anxiety
- Maintain clear boundaries

### 2. Tone Adaptation
- Match user's emotional state
- Keep explanations simple
- Maintain warmth
- Stay authentic

### 3. Accessibility
- Clear contrast
- Readable fonts
- Screen reader friendly
- Keyboard navigation

### 4. Usage Guidelines
- Keep messages brief
- Use simple language
- Maintain consistency
- Focus on support

## Environment-Specific Notes

### Production Environment
- Focus on user support
- Emphasize privacy and control
- Maintain gentle tone
- Keep technical details minimal

### Development Environment
- Include testing context
- Allow for feature exploration
- Maintain professional tone
- Provide clear environment indicators

## Integration Notes

### 1. Context Awareness
- Consider user preferences
- Factor in emotional state
- Monitor comfort level
- Adapt to needs

### 2. Tone Blending
- Allow for natural flow
- Maintain consistency
- Adapt to context
- Keep it authentic

### 3. Message Types
- Welcome messages
- Settings explanations
- Privacy notes
- Feature introductions

### 4. Future Considerations
- Additional languages
- Cultural adaptations
- Context variations
- User feedback 