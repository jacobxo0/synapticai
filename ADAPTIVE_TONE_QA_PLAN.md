# Adaptive Tone QA Plan

## Test Environment
- Environment: Staging
- Test Account: test_${Date.now()}@mindmate.com
- Timestamp: ${new Date().toISOString()}
- Log Level: DEBUG

## Assumptions
1. Base tone selection takes precedence over adaptive suggestions
2. Mood influence is secondary to explicit tone selection
3. Tone shifts require clear user context changes
4. Mid-conversation tone shifts maintain context
5. Analytics events track all tone-related decisions

## Test Matrix

### Mood × Tone × Prompt Type
| Mood State | Selected Tone | Prompt Type | Expected Behavior |
|------------|---------------|-------------|-------------------|
| Happy      | Supportive    | General     | Maintain tone     |
| Happy      | Direct        | Action      | Maintain tone     |
| Happy      | Curious       | Reflective  | Maintain tone     |
| Anxious    | Supportive    | Emotional   | Maintain tone     |
| Anxious    | Direct        | Problem     | Maintain tone     |
| Anxious    | Curious       | Exploration | Maintain tone     |
| Sad        | Supportive    | Emotional   | Maintain tone     |
| Sad        | Direct        | Solution    | Maintain tone     |
| Sad        | Curious       | Reflection  | Maintain tone     |

## Tone Shift Triggers

### 1. Context-Based Shifts
- **Trigger**: Clear change in conversation topic
- **Example**: 
  ```
  User: "I'm feeling anxious about work"
  Claude: [Supportive response]
  User: "Can you help me make a plan?"
  Claude: [Suggests shift to Direct tone]
  ```
- **Expected**: Suggestion only, no automatic shift

### 2. Mood-Influenced Suggestions
- **Trigger**: Significant mood change detected
- **Example**:
  ```
  Mood: Happy → Anxious
  Current Tone: Direct
  Expected: Suggestion to shift to Supportive
  ```
- **Expected**: Suggestion only, maintain current tone

### 3. User-Initiated Shifts
- **Trigger**: Explicit tone selection
- **Example**:
  ```
  User selects "Direct" tone
  Mood: Anxious
  Expected: Maintain Direct tone
  ```
- **Expected**: Immediate tone change, override suggestions

## Edge Cases

### 1. Mid-Conversation Tone Shifts
```typescript
// Test Case: Tone consistency during conversation
async function testMidConversationTone() {
  // Start with supportive tone
  await setTone('supportive')
  await sendMessage("I'm feeling overwhelmed")
  
  // Verify tone maintained
  const response1 = await getLastResponse()
  expect(response1.tone).toBe('supportive')
  
  // Change context
  await sendMessage("What should I do?")
  
  // Verify tone maintained despite context change
  const response2 = await getLastResponse()
  expect(response2.tone).toBe('supportive')
}
```

### 2. Rapid Mood Changes
```typescript
// Test Case: Mood changes don't override tone
async function testMoodChanges() {
  // Set initial state
  await setTone('direct')
  await setMood('happy')
  
  // Rapid mood changes
  await setMood('anxious')
  await sendMessage("I need help")
  const response1 = await getLastResponse()
  expect(response1.tone).toBe('direct')
  
  await setMood('sad')
  await sendMessage("I'm not sure what to do")
  const response2 = await getLastResponse()
  expect(response2.tone).toBe('direct')
}
```

## Success Criteria

### 1. Tone Integrity
- [ ] Selected tone maintained for 95% of responses
- [ ] Tone suggestions don't cause automatic shifts
- [ ] Mood changes don't override explicit tone selection

### 2. Response Consistency
- [ ] Claude responses match selected tone markers
- [ ] No tone bleed between different tones
- [ ] Context changes don't cause unexpected shifts

### 3. User Experience
- [ ] Clear indication of current tone
- [ ] Tone suggestions are contextual
- [ ] Easy to override suggestions

## Logging Requirements

### 1. Tone Decision Logging
```typescript
interface ToneDecisionLog {
  timestamp: string
  selectedTone: string
  suggestedTone: string | null
  mood: string
  context: string
  userOverride: boolean
  finalTone: string
}
```

### 2. Analytics Events
```typescript
interface ToneAnalytics {
  event: 'tone.selected' | 'tone.suggested' | 'tone.shifted'
  properties: {
    fromTone: string
    toTone: string
    trigger: string
    mood: string
    context: string
  }
}
```

## Test Execution

### 1. Automated Tests
```typescript
// Test suite for adaptive tone
describe('Adaptive Tone Behavior', () => {
  test('maintains selected tone despite mood changes')
  test('suggests appropriate tone shifts')
  test('respects user tone overrides')
  test('handles mid-conversation context changes')
  test('logs tone decisions correctly')
})
```

### 2. Manual Tests
- [ ] Verify tone consistency across long conversations
- [ ] Test tone suggestions in various contexts
- [ ] Validate logging and analytics
- [ ] Check UI feedback for tone changes

## Next Steps
1. Implement automated test suite
2. Set up logging and analytics
3. Run manual validation
4. Document findings and recommendations 