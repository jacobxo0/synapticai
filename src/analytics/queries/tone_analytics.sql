-- Tone Selection Distribution
SELECT 
    properties->>'tone' as tone,
    COUNT(*) as selection_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM events
WHERE event = 'tone.selected'
    AND timestamp >= NOW() - INTERVAL '30 days'
GROUP BY properties->>'tone'
ORDER BY selection_count DESC;

-- Time to First Selection
WITH first_selections AS (
    SELECT 
        distinct_id,
        MIN(timestamp) as first_selection_time
    FROM events
    WHERE event = 'tone.selected'
        AND timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY distinct_id
),
session_starts AS (
    SELECT 
        distinct_id,
        MIN(timestamp) as session_start_time
    FROM events
    WHERE event = '$pageview'
        AND timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY distinct_id
)
SELECT 
    AVG(EXTRACT(EPOCH FROM (fs.first_selection_time - ss.session_start_time))/60) as avg_minutes,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (fs.first_selection_time - ss.session_start_time))/60) as median_minutes,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (fs.first_selection_time - ss.session_start_time))/60) as percentile_75
FROM first_selections fs
JOIN session_starts ss ON fs.distinct_id = ss.distinct_id;

-- Selection Frequency
SELECT 
    distinct_id,
    COUNT(*) as selections_per_session
FROM events
WHERE event = 'tone.selected'
    AND timestamp >= NOW() - INTERVAL '30 days'
GROUP BY distinct_id, session_id;

-- User Flow Analysis
WITH user_flows AS (
    SELECT 
        distinct_id,
        array_agg(event ORDER BY timestamp) as flow
    FROM events
    WHERE timestamp >= NOW() - INTERVAL '30 days'
        AND event IN ('$pageview', 'tone.selected', 'chat.message')
    GROUP BY distinct_id, session_id
)
SELECT 
    flow_pattern,
    COUNT(*) as flow_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM (
    SELECT 
        CASE 
            WHEN flow @> ARRAY['$pageview', 'chat.message', 'tone.selected'] THEN 'Landing → Chat → Tone Selection'
            WHEN flow @> ARRAY['$pageview', 'tone.selected', 'chat.message'] THEN 'Onboarding → Tone Selection → Chat'
            WHEN flow @> ARRAY['settings', 'tone.selected', 'chat.message'] THEN 'Settings → Tone Selection → Chat'
            ELSE 'Other paths'
        END as flow_pattern
    FROM user_flows
) patterns
GROUP BY flow_pattern
ORDER BY flow_count DESC;

-- Drop-off Analysis
SELECT 
    event,
    COUNT(*) as event_count,
    ROUND(COUNT(*) * 100.0 / LAG(COUNT(*)) OVER (ORDER BY event_sequence), 1) as dropoff_percentage
FROM (
    SELECT 
        event,
        ROW_NUMBER() OVER (PARTITION BY distinct_id, session_id ORDER BY timestamp) as event_sequence
    FROM events
    WHERE timestamp >= NOW() - INTERVAL '30 days'
        AND event IN ('tone.selected', 'chat.message')
) sequenced_events
GROUP BY event, event_sequence
ORDER BY event_sequence; 