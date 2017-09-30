#!/usr/bin/perl

open (FILE, 'error.txt');

while (<FILE>) {
  if (/^Usage/i) {
    print $_;
      next;
  }
  elsif (/^\s.*/i) {
    print $_;
    
  }

 }
close (FILE);
exit;