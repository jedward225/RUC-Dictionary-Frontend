class FrequencyChart {
    constructor() {
        this.chart = null;
        // 流星雨色系
        this.colors = {
            glowCyan: '#00d4ff',
            meteorPurpleDeep: '#8A4B9C',
            meteorPurpleSoft: '#C08EAF',
            meteorBlueLight: '#93B5CF',
            niloBlue: '#2474B5',
            starYellow: '#FBDA41'
        };
    }

    createGradient(ctx, chartArea) {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.05)');
        gradient.addColorStop(0.5, 'rgba(36, 116, 181, 0.15)');
        gradient.addColorStop(1, 'rgba(138, 75, 156, 0.25)');
        return gradient;
    }

    create(frequencyData) {
        const ctx = document.getElementById('frequency-chart').getContext('2d');

        if (this.chart) {
            this.chart.destroy();
        }

        const years = frequencyData.map(item => item.year);
        const counts = frequencyData.map(item => item.count);

        // 创建发光线条渐变
        const lineGradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
        lineGradient.addColorStop(0, this.colors.glowCyan);
        lineGradient.addColorStop(0.5, this.colors.meteorBlueLight);
        lineGradient.addColorStop(1, this.colors.meteorPurpleSoft);

        const self = this;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: '使用频次 / Frequency',
                    data: counts,
                    borderColor: lineGradient,
                    backgroundColor: function(context) {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) {
                            return 'rgba(0, 212, 255, 0.1)';
                        }
                        return self.createGradient(ctx, chartArea);
                    },
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.glowCyan,
                    pointBorderColor: 'rgba(0, 212, 255, 0.5)',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 10,
                    pointHoverBackgroundColor: this.colors.starYellow,
                    pointHoverBorderColor: 'rgba(251, 218, 65, 0.5)',
                    pointHoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: this.colors.meteorBlueLight,
                            font: {
                                size: 14,
                                family: 'Inter, sans-serif'
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 20, 50, 0.9)',
                        titleColor: this.colors.glowCyan,
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(0, 212, 255, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            title: function(context) {
                                return `${context[0].label} 年`;
                            },
                            label: function(context) {
                                return `使用频次: ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '年份 / Year',
                            color: this.colors.meteorBlueLight,
                            font: {
                                size: 13,
                                family: 'Inter, sans-serif'
                            }
                        },
                        ticks: {
                            color: this.colors.meteorBlueLight,
                            font: {
                                size: 12,
                                family: 'Inter, sans-serif'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 212, 255, 0.08)',
                            lineWidth: 1
                        },
                        border: {
                            color: 'rgba(0, 212, 255, 0.2)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '使用频次 / Frequency',
                            color: this.colors.meteorBlueLight,
                            font: {
                                size: 13,
                                family: 'Inter, sans-serif'
                            }
                        },
                        ticks: {
                            color: this.colors.meteorBlueLight,
                            font: {
                                size: 12,
                                family: 'Inter, sans-serif'
                            },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 212, 255, 0.08)',
                            lineWidth: 1
                        },
                        border: {
                            color: 'rgba(0, 212, 255, 0.2)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'easeInOutQuart',
                        from: 1,
                        to: 0.4,
                        loop: false
                    },
                    y: {
                        duration: 1500,
                        easing: 'easeOutElastic',
                        from: (ctx) => ctx.chart.scales.y.getPixelForValue(0)
                    }
                }
            }
        });
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// 扩展 BuzzwordDisplay 类以使用独立的图表功能
if (typeof window !== 'undefined') {
    window.createFrequencyChart = function(frequencyData) {
        if (!window.frequencyChartInstance) {
            window.frequencyChartInstance = new FrequencyChart();
        }
        window.frequencyChartInstance.create(frequencyData);
    };
}