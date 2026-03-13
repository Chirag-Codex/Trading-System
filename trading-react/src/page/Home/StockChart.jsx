import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import ReactApexChart from "react-apexcharts"
import { useDispatch, useSelector } from "react-redux"
import { fetchMarketChart } from "@/State/Coin/Action"

function StockChart({ coinId }) {
    const dispatch = useDispatch()
    const [activeLabel, setActiveLabel] = React.useState("1 Month") // Default to 1 Month
    const { coin } = useSelector(store => store)
    
    const timeSeries = [
        { label: "1 Day", value: 1 },
        { label: "1 Week", value: 7 },
        { label: "1 Month", value: 30 },
        { label: "1 Year", value: 365 },
    ]

    useEffect(() => {
        if (coinId) {
            const selectedSeries = timeSeries.find(item => item.label === activeLabel)
            const days = selectedSeries ? selectedSeries.value : 30
            console.log("Fetching chart data for:", coinId, "days:", days)
            dispatch(fetchMarketChart({ 
                coinId, 
                days, 
                jwt: localStorage.getItem("jwt") 
            }))
        }
    }, [dispatch, coinId, activeLabel])
    if (coin.marketChart?.loading) {
        return (
            <div className="flex justify-center items-center h-[450px]">
                <div className="text-[#D6C9F0]">Loading chart data...</div>
            </div>
        )
    }

    const chartData = coin.marketChart?.data || []
    
    if (chartData.length === 0) {
        return (
            <div>
                <div className="space-x-3 mb-4">
                    {timeSeries.map((item) => (
                        <Button
                            key={item.label}
                            onClick={() => setActiveLabel(item.label)}
                            variant={activeLabel === item.label ? "default" : "outline"}
                            className={
                                activeLabel === item.label
                                    ? "bg-[#D6C9F0] text-black hover:bg-[#C3B1E1]"
                                    : "border-[#D6C9F0] text-[#D6C9F0]"
                            }
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
                <div className="flex justify-center items-center h-[400px] text-[#D6C9F0]">
                    No chart data available for {coinId}
                </div>
            </div>
        )
    }

    const series = [
        {
            name: "Price",
            data: chartData.map(item => [item[0], item[1]]) 
        },
    ]

    const options = {
        chart: {
            id: "area-datetime",
            type: "area",
            height: 450,
            zoom: {
                autoScaleYaxis: true,
            },
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                }
            }
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            type: "datetime",
            tickAmount: 6,
            labels: {
                style: {
                    colors: "#D6C9F0",
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#D6C9F0",
                },
                formatter: (value) => `$${value.toFixed(2)}`
            }
        },
        colors: ["#D6C9F0"],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        markers: {
            size: 0,
            colors: ["#E0D4F7"],
            strokeColor: "#E0D4F7",
            strokeWidth: 1,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.2,
                stops: [0, 100],
            },
        },
        tooltip: {
            theme: "dark",
            x: {
                format: "dd MMM yyyy HH:mm",
            },
            y: {
                formatter: (value) => `$${value.toFixed(2)}`,
            },
        },
        grid: {
            show: true,
            borderColor: "#D6C9F0",
            strokeDashArray: 4,
        },
    }

    return (
        <div>
            <div className="space-x-3 mb-4">
                {timeSeries.map((item) => (
                    <Button
                        key={item.label}
                        onClick={() => setActiveLabel(item.label)}
                        variant={activeLabel === item.label ? "default" : "outline"}
                        className={
                            activeLabel === item.label
                                ? "bg-[#D6C9F0] text-black hover:bg-[#C3B1E1]"
                                : "border-[#D6C9F0] text-[#D6C9F0] hover:bg-[#D6C9F0] hover:text-black"
                        }
                    >
                        {item.label}
                    </Button>
                ))}
            </div>

            {chartData.length > 0 ? (
                <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={450}
                />
            ) : (
                <div className="flex justify-center items-center h-[400px] text-[#D6C9F0]">
                    Loading chart data...
                </div>
            )}
        </div>
    )
}

export default StockChart