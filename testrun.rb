# encoding: utf-8 

require 'rubygems'
require 'optparse'
require 'open-uri'

if RUBY_PLATFORM == 'i386-mingw32'
  require 'watir'
else
  require 'watir-webdriver'
end

class TestRunner
  
  def initialize(suite, config = {})
    body = nil
    open(suite) do |f|
      body = f.read 
    end
    @config = retrieve_config body
    @config[:runner] = config[:runner] || default_runner
    @tests = retrieve_tests body
    run
  end

  def retrieve_config(body)
    config = {}
    body.scan(/@([\w-]+)\s+(.*)$/) do |m|
      config[m[0].to_sym] = m[1]
    end
    config 
  end

  def default_runner
    #File.join File.absolute_path(File.dirname(__FILE__)), 'test.htm'
    'http://localhost/prettyjasmine/test.htm'
  end

  def retrieve_tests(body)
    tests = []
    body.scan(/importjs\s*\(\s*\[?([^\]]+)\]?\)/) do |m|
      m[0].split(/,/).each do |url|
        tests << url.sub(/^\s*['"]/, '').sub(/['"]\s*$/, '')
      end
    end
    tests
  end
  
  def run
    @browser = Watir::Browser.new
    @tests.each do |test|
      run_test test
    end
    @browser.close
  end

  def run_test(test)
    puts "run test: #{test}"
    url = "#{@config[:runner]}?base=#{@config[:base]}&test=#{test}"

    @browser.goto url
    div = @browser.element(:css => 'div.runner')
    div.wait_until_present
    Watir::Wait.until { div.class_name =~ /failed|passed/ }
    des = @browser.element(:css => 'a.description')
    puts des.text
  end
end


if $0 == __FILE__
  options = {}

  opts = OptionParser.new do |opts|
    opts.banner = "Usage: ruby #{$0} [-r url ] url"

    opts.on('-r', '--runner [url]', 'test runner url') do |runner|
      options[:runner] = runner
    end

    opts.on_tail('-h', '--help', 'show help info') do
      puts opts
      exit
    end
  end

  rest = opts.parse! ARGV

  unless rest.size > 0
    puts opts 
    exit
  end 

  suite = rest[0]
  TestRunner.new suite, options
end

