import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from posthog import Posthog
from datetime import datetime, timedelta
import json

# Initialize PostHog client
posthog = Posthog(
    api_key='your_api_key',
    host='https://app.posthog.com'
)

def fetch_tone_data():
    """Fetch tone analytics data from PostHog"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    # Fetch tone selection events
    tone_events = posthog.events(
        event='tone.selected',
        after=start_date.isoformat(),
        before=end_date.isoformat()
    )
    
    return pd.DataFrame(tone_events)

def analyze_tone_distribution(df):
    """Analyze tone selection distribution"""
    tone_counts = df['properties.tone'].value_counts()
    return tone_counts

def plot_tone_distribution(tone_counts):
    """Create pie chart of tone distribution"""
    plt.figure(figsize=(10, 6))
    plt.pie(tone_counts, labels=tone_counts.index, autopct='%1.1f%%')
    plt.title('Tone Selection Distribution')
    plt.savefig('tone_distribution.png')
    plt.close()

def analyze_time_to_first_selection(df):
    """Analyze time to first tone selection"""
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    first_selections = df.groupby('distinct_id')['timestamp'].min()
    session_starts = df[df['event'] == '$pageview'].groupby('distinct_id')['timestamp'].min()
    
    time_to_first = (first_selections - session_starts).dt.total_seconds() / 60
    return {
        'average': time_to_first.mean(),
        'median': time_to_first.median(),
        'percentile_75': time_to_first.quantile(0.75)
    }

def analyze_user_flows(df):
    """Analyze common user flows"""
    flows = df.groupby(['distinct_id', 'session_id'])['event'].apply(list)
    flow_patterns = flows.value_counts().head(5)
    return flow_patterns

def generate_report():
    """Generate comprehensive tone analytics report"""
    df = fetch_tone_data()
    
    # Analyze data
    tone_distribution = analyze_tone_distribution(df)
    time_metrics = analyze_time_to_first_selection(df)
    user_flows = analyze_user_flows(df)
    
    # Create visualizations
    plot_tone_distribution(tone_distribution)
    
    # Generate report data
    report_data = {
        'tone_distribution': tone_distribution.to_dict(),
        'time_metrics': time_metrics,
        'user_flows': user_flows.to_dict(),
        'total_users': df['distinct_id'].nunique(),
        'total_selections': len(df),
        'period': 'Last 30 days'
    }
    
    # Save report data
    with open('tone_analytics_data.json', 'w') as f:
        json.dump(report_data, f, indent=2)

if __name__ == '__main__':
    generate_report() 